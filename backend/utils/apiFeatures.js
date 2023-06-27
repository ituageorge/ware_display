// const { search } = require("../app");

class APIFeatures {
    constructor(query, queryStr) {
//query is like Product.find

        this.query = query;
        this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        console.log('keyword', keyword)

        this.query = this.query.find({ ...keyword });
        return this;
    }
}

module.exports = APIFeatures
