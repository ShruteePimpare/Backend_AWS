#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
// import { ProductServiceStack } from '../lib/backend-app-stack';
import { ImportServiceStack } from '../lib/import-service-stack';
import { ProductServiceStack } from '../lib/backend-app-stack';


const app = new cdk.App();
new ProductServiceStack(app, 'ProductServiceStack');
// new ImportServiceStack(app, 'ImportServiceStack');

