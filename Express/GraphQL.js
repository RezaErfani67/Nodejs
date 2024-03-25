const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Define MongoDB schemas
const authorSchema = new mongoose.Schema({
    name: String
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

// Define GraphQL schema
const schema = buildSchema(`
    type Book {
        id: ID
        title: String
        author: Author
    }

    type Author {
        id: ID
        name: String
        books: [Book]
    }

    type Query {
        books: [Book]
        authors: [Author]
    }

    type Mutation {
        createAuthor(name: String!): Author
        updateAuthor(authorId: ID!, name: String!): Author
        deleteAuthor(authorId: ID!): ID
        createBook(title: String!, authorId: ID!): Book
        updateBook(bookId: ID!, title: String!): Book
        deleteBook(bookId: ID!): ID
    }
`);

// Define resolvers
const root = {
    books: async () => await Book.find(),
    authors: async () => await Author.find(),

    createAuthor: async ({ name }) => {
        const author = new Author({ name });
        await author.save();
        return author;
    },

    updateAuthor: async ({ authorId, name }) => {
        const author = await Author.findByIdAndUpdate(authorId, { name }, { new: true });
        if (!author) throw new Error('Author not found');
        return author;
    },

    deleteAuthor: async ({ authorId }) => {
        const author = await Author.findByIdAndDelete(authorId);
        if (!author) throw new Error('Author not found');
        await Book.deleteMany({ author: authorId });
        return authorId;
    },

    createBook: async ({ title, authorId }) => {
        const book = new Book({ title, author: authorId });
        await book.save();
        return book;
    },

    updateBook: async ({ bookId, title }) => {
        const book = await Book.findByIdAndUpdate(bookId, { title }, { new: true });
        if (!book) throw new Error('Book not found');
        return book;
    },

    deleteBook: async ({ bookId }) => {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) throw new Error('Book not found');
        return bookId;
    }
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Initialize Express app
const app = express();

// Mount GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
