require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db.config');
const cors = require('cors');

connectDb(); 

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', require('./routes/auth.routes'));
app.use('/products', require('./routes/products.routes'));
app.use('/', require('./routes/productsReview.routes'))


app.use(require('./middlewares/auth.middleware'));

app.use('/users', require('./routes/user.routes'));
app.use('/cart', require('./routes/cart.routes'));
app.use('/', require('./routes/order.routes'));
app.use('/', require('./routes/favorites.routes'));
app.use('/', require('./routes/reviews.routes'))



app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`));