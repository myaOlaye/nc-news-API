# NC News API

## Description
This is a REST API for a news application where users can read articles, leave comments, and more.  

### Hosted Version

You can access the live version of the project here: **https://myas-news-api.onrender.com/api**. Please note, it may take a minute to load as the server spins up on Render.

## Getting Started

To get started with this project locally, you will need to have Node.js and PostgreSQL installed. Then, follow the instructions below.

### Cloning the Repository

1. Clone the repository to your local machine:

   ```bash
   git clone [your-repo-link]
   cd [your-repo-folder]

## Install all dependencies

1. Install all required dependencies:
   
   ```bash
   npm install

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
       
### Seeding the Database

Create and seed the local development database:

```bash
npm run setup-dbs
npm run seed
```
### Running Tests

To ensure everything is working as expected, run the test suite:

```bash
npm test
```
Once the setup is complete, you can explore the API locally
---
