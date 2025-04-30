# 🛠️ Product Service – AWS CDK Microservice (Backend)

This backend project provides product data using AWS infrastructure as code via **AWS CDK**. It includes two Lambda functions exposed through **API Gateway** and responds with mock product data.

---

## 📦 Tech Stack

- AWS CDK (TypeScript)
- AWS Lambda
- AWS API Gateway
- TypeScript
- Node.js 18.x

---

## 📌 Features

- `GET /products`: Returns a list of mock products
- `GET /products/{productId}`: Returns a single product by ID

---

## 🚀 Deployment Instructions

### 1. Install dependencies

```bash
npm install
2. Bootstrap CDK (first time only)

cdk bootstrap
3. Deploy to AWS

cdk deploy
The output will include the API Gateway URL, like:


https://your-api-id.execute-api.region.amazonaws.com/prod/
🌐 API Endpoints

Method	Endpoint	Description
GET	/products	Get all products
GET	/products/{productId}	Get product by ID