# Northcoders News API

## Environment Setup

To successfully run the project locally, you need to set up the necessary environment variables. These variables are stored in `.env` files, follow the steps below to ensure the correct setup:

1. **Create Environment Files**: 
   - Create two `.env` files in the root of the project:
     - `.env.development`
     - `.env.test`

2. **Add Environment Variables**:
   - Add the following variables to these files:
     - **For `.env.development`:**
       ```env
       PGDATABASE=nc_news
       ```
     - **For `.env.test`:**
       ```env
       PGDATABASE=nc_news_test
       ```
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
