const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql')
const axios = require('axios')
const imageQueryType = new GraphQLObjectType({
    name:'image',
    fields:{
        small: { type: GraphQLString },
        large: { type: GraphQLString },
        medium: { type: GraphQLString }
    }
})
const movieQueryType = new GraphQLObjectType({
    name:"movie",
    fields:{
       id:{
           type:GraphQLString
       },
       title:{
           type:GraphQLString 
       },
       images:{
           type:imageQueryType
       },
       img:{
           type:GraphQLString,
           resolve(obj){
               return obj.images.small
           }
       }
    }
})
const authorQueryType = new GraphQLObjectType({
    name:'authorQuery',
    fields:{
        name:{
            type:GraphQLString
        }
    }
})
const articleQueryType = new GraphQLObjectType({
    name:'articleQuery',
    fields:{
        id:{
            type:GraphQLInt
        },
        authorId:{
            type:GraphQLInt
        },
        title:{
            type:GraphQLString
        },
        authorInfo:{
            type:authorQueryType,
            resolve(obj){
                //resolve的第一个参数，为当前对象
                return axios.get(`http://localhost:3000/users/${obj.authorId}`)
                            .then(res=>res.data)
            }
        }
    }
})
//根查询类型
const rootQueryType = new GraphQLObjectType({
    name:'rootQuery',
    fields:{  //字段
        hello:{
            type:GraphQLString,  //字段类型(查询结果的类型)
            resolve(){   //返回值就是这个字段的查询结果
                return "hello world"
            }
        },
        num:{
            type:GraphQLInt,
            resolve(){
                return 123
            }
        },
        articles:{
            type:new GraphQLList(articleQueryType),
            resolve(){
                //获取apiserver的数据并整合
                return axios.get('http://localhost:3000/articles')
                            .then(res=>res.data)
            }
        },
        //传参实例，利用豆瓣接口
        movies:{
            type:new GraphQLList(movieQueryType),
            //接收到的参数(在本例子中用于从多个数据中取出几个)
            args:{
                count:{
                    type:GraphQLInt
                }
            },
            resolve(obj,args){
                //第二个为传递过来的参数
                return axios.get(`https://api.douban.com/v2/movie/top250?count=${args.count}`)
                            .then(res=>{
                                return res.data.subjects
                            })
            }
        }
    }
})

//用于提供查询手段的对象
const schema = new GraphQLSchema({
    query:rootQueryType
})
module.exports = schema