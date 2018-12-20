//开启一个node服务器
const express = require('express')
const app = express()
const { graphql } = require('graphql')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
app.use('/index',(req,res)=>{
    res.send('ok')
})
//启动graphql可视化操作界面，方便调试
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))
app.use('/test',(req,res)=>{
    //查询字段语句
    let query = `
        query one {
            num,
            hello
        }
    `
    graphql(schema,query).then(result=>{
        res.json(result)
    })
})
//整合ariticle和users接口
app.use('/ariticle',(req,res)=>{
    let query = `
        query two {
            articles {
                id,
                title,
                authorId,
                authorInfo{
                  name
                }
            }
        }
    `
    graphql(schema,query).then(result=>{
        res.json(result)
    })
})
//传递参数后处理数据
app.use('/movies',(req,res)=>{
    let { count } = req.query
    let query = `
        query three{
            movies(count:${~~count}){
                id,
                img
            }
        }
    `
    graphql(schema,query).then(result=>{
        res.json(result)
    })
})
app.listen(9000) 
console.log('server is run in 9000')