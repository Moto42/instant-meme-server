const app = require('./server');

if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config();

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port ${port}`));