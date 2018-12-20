#### 场景
* api请求是前端开发一个必不可少的环节，但是当一个页面api请求次数过多可能会导致页面加载过久等问题
* 在api请求得到的数据中，经常会出现许多我们不需要的数据，通过询问后端的同学，了解到一下原因
~~~
    (1)为了兼容web端的需求
    (2)一个接口需要同时为多个平台提供内容
    (3)如果专门提供对应的接口，需求经常改动导致接口很难为单一接口精简逻辑
~~~
#### 思考
* 明确需要处理的问题
~~~
    (1)兼容多平台导致字段冗余
    (2)一个页面需要多次调用api
    (3)前端需求经常改动导致接口很难与其对应
~~~
* 处理这些问题的想法
~~~
    兼容多平台
        可以通过提供不同平台的接口来解决
            例如：
                http://api.xxx.com/web/getUserInfo/:uid
                http://api.xxx.com/app/getUserInfo/:uid
                http://api.xxx.com/mobile/getUserInfo/:uid

        或者是通过不同的参数去控制
            例如：http://api.xxx.com/getUserInfo/:uid?platfrom=web

        评价：虽然是个很方便的解决办法，但是给后端带来了大量的逻辑，需要进行维护不同平台的逻辑代码    
~~~
#### 解决，利用GraphQL
* GraphQL能干嘛？
~~~
    帮助我们搭建中间服务器来整合，处理api请求，对请求到的字段处理为按需返回
~~~
#### 模拟场景使用
* 使用json-server充当api服务器
~~~
    (1)创建一个一个db.json存放一些数据(默认端口3000)
    (2)json-server是符合restful-api接口设计规范的
    (3)为每一个字段生成出一个接口
    json-server --watch db.json
~~~
* 使用express充当中间层服务器
~~~
    (1)开启一个Node服务器(端口9000)
    (2)启动graphql可视化操作界面，方便调试
        app.use('/graphql',graphqlHTTP({
            schema, 
            graphiql:true
        }))
        app.use('/hello',(req,res)=>{
            let query = `
                query one {
                    hello
                }
            `
             graphql(schema,query).then(result=>{
                res.json(result)
            })
            //当在地址栏访问localhost:9000/hello   //会得到包含hello字段的数据
        })
    (3)创建schema.js //用于提供查询手段的对象
        const schema = new GraphQLSchema({
            query:rootQueryType //根查询类型
        })
    (4)const rootQueryType = new GraphQLObjectType({
        name:"rootQuery",
        fields:{  //字段
            hello:{
                type:GraphQLString,  //查询字段类型
                resolve(){   //返回值就是这个字段的查询结果
                    return "hello world"
                }
            }
            //当在可视化界面查询hello时会得到一段数据里面只有hello字段的信息
        }
    })
~~
* 整合接口，接口传参,在GrapQl中发送api请求后做处理
[github地址]()