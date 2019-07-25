const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");
const Product = require("../models/product");
const Category = require("../models/category");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
    } = graphql;

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: ()=> ({
        id: {type: GraphQLID},
        nombre: {type: GraphQLString},
        precio: {type: GraphQLString},
        categoryId: {
            type: CategoryType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId});
                return Category.findById(parent.categoryId);
            }
        },
        plan: {type: GraphQLString},
        modalidad: {type: GraphQLString},
        canal: {type: GraphQLString}
    })
});


const BookType = new GraphQLObjectType({
    name: "Book",
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
               // return _.filter(books, {authorId: parent.id});
               return Book.find({authorId: parent.id});
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: "Category",
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
               // return _.filter(books, {authorId: parent.id});
               return Product.find({categoryId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},

            resolve(partent, args){
                // code to get data from db / other source

               // return _.find(books, {id: args.id});
               return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: {type: GraphQLID}},
            resolve(partent, args){
               // return _.find(authors, {id: args.id});
               return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
              //  return books;
              return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
                resolve(parent,args){
                 //   return authors;
                 return Author.find({});
                }
            
        },
        product: {
            type: ProductType,
            args: {id: {type: GraphQLID}},

            resolve(partent, args){
                // code to get data from db / other source

               // return _.find(books, {id: args.id});
               return Product.findById(args.id);
            }
        }, 
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
              //  return products;
              return Product.find({});
            }
        },
        category: {
            type: CategoryType,
            args: {id: {type: GraphQLID}},

            resolve(partent, args){
                // code to get data from db / other source

               // return _.find(books, {id: args.id});
               return Category.findById(args.id);
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args){
              //  return products;
              return Category.find({});
            }
        }, 
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},       // GraphQLNonNull prevent to save as null value.
                age: {type: new GraphQLNonNull(GraphQLString)}            // GraphQLNonNull prevent to save as null value.
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addCategory:{
            type: CategoryType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},       // GraphQLNonNull prevent to save as null value.
            },
            resolve(parent, args){
                let category = new Category({
                    name: args.name,
                });
                return category.save();
            }
        },



        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},    // GraphQLNonNull prevent to save as null value.
                genre: {type: new GraphQLNonNull(GraphQLString)},   // GraphQLNonNull prevent to save as null value.
                authorId: {type: new GraphQLNonNull(GraphQLID)}     // GraphQLNonNull prevent to save as null value.
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                nombre: {type: new GraphQLNonNull(GraphQLString)},    // GraphQLNonNull prevent to save as null value.
                precio: {type: new GraphQLNonNull(GraphQLString)},
                categoryId: {type: new GraphQLNonNull(GraphQLID)},
                plan: {type: new GraphQLNonNull(GraphQLString)},
                modalidad: {type: new GraphQLNonNull(GraphQLString)},
                canal: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                let product = new Product({
                    nombre: args.nombre,
                    precio: args.precio,
                    categoryId: args.categoryId,
                    plan: args.plan,
                    modalidad: args.modalidad,
                    canal: args.canal,
                });
                return product.save();
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

