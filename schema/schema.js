const graphql = require("graphql");
const _ = require("lodash");
const Product = require("../models/product");
const Category = require("../models/category");
const Plan = require("../models/plans");

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
        precio: {type: GraphQLInt},
        categoryId: {
            type: CategoryType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId});
                return Category.findById(parent.categoryId);
            }
        },
        planId: {
            type: PlanType,
            resolve(parent, args){
                return Plan.findById(parent.planId);
            }
        },
        modalidad: {type: GraphQLString},
        canal: {type: GraphQLString},
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
const PlanType = new GraphQLObjectType({
    name: "Plan",
    fields: ()=> ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args){
               // return _.filter(books, {authorId: parent.id});
               return Product.find({planId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {

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
        plan: {
            type: PlanType,
            args: {id: {type: GraphQLID}},

            resolve(partent, args){
               return Plan.findById(args.id);
            }
        },
        plans: {
            type: new GraphQLList(PlanType),
            resolve(parent, args){
              //  return products;
              return Plan.find({});
            }
        }, 

    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
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
        addPlan:{
            type: PlanType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},       // GraphQLNonNull prevent to save as null value.
            },
            resolve(parent, args){
                let plan = new Plan({
                    name: args.name,
                });
                return plan.save();
            }
        },

        addProduct: {
            type: ProductType,
            args: {
                nombre: {type: new GraphQLNonNull(GraphQLString)},    // GraphQLNonNull prevent to save as null value.
                precio: {type: new GraphQLNonNull(GraphQLString)},
                categoryId: {type: new GraphQLNonNull(GraphQLID)},
                planId: {type: new GraphQLNonNull(GraphQLID)},
                modalidad: {type: new GraphQLNonNull(GraphQLString)},
                canal: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                let product = new Product({
                    nombre: args.nombre,
                    precio: args.precio,
                    categoryId: args.categoryId,
                    planId: args.planId,
                    modalidad: args.modalidad,
                    canal: args.canal,
                    canal: args.creationDate,
                });
                return product.save();
            }
        },
        removeProduct: {
            type: ProductType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},    // GraphQLNonNull prevent to save as null value.
            },
            resolve(parent, args){
                const removedProduct = Product.findByIdAndRemove(args.id).exec();
                if (!removedProduct) {
                    throw new Error("Error")
                }
                return removedProduct;
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

