"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const s3Notifications = require("aws-cdk-lib/aws-s3-notifications");
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
class ImportServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Step 1: Create S3 Bucket
        const importBucket = new s3.Bucket(this, 'ImportBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
        });
        // Step 2: Define the importProductsFile Lambda function
        const importProductsFile = new lambda.Function(this, 'ImportProductsFile', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'importProductsFile.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: importBucket.bucketName,
            },
        });
        importBucket.grantPut(importProductsFile);
        // Step 3: Define API Gateway with CORS handled manually like ProductService
        const api = new apiGateway.RestApi(this, 'ImportApi', {
            restApiName: 'ImportServiceAPI',
            description: 'This service handles file imports and parsing.',
        });
        const importResource = api.root.addResource('import');
        importResource.addMethod('GET', new apiGateway.LambdaIntegration(importProductsFile, {
            integrationResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Origin': "'*'",
                    },
                },
            ],
        }), {
            methodResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Origin': true,
                    },
                },
            ],
        });
        // Also add CORS preflight for GET (like in ProductServiceStack)
        importResource.addCorsPreflight({
            allowOrigins: apiGateway.Cors.ALL_ORIGINS,
            allowMethods: ['GET'],
        });
        // Step 4: Define the importFileParser Lambda
        const importFileParser = new lambda.Function(this, 'ImportFileParser', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'importFileParser.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
            environment: {
                BUCKET_NAME: importBucket.bucketName,
            },
        });
        importBucket.grantRead(importFileParser);
        importBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(importFileParser), { prefix: 'uploaded/' });
        // Step 5: Grant permissions
        importProductsFile.addToRolePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:PutObject'],
            resources: [`${importBucket.bucketArn}/*`],
        }));
        importFileParser.addToRolePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject', 's3:CopyObject', 's3:DeleteObject'],
            resources: [`${importBucket.bucketArn}/*`],
        }));
    }
}
exports.ImportServiceStack = ImportServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LXNlcnZpY2Utc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbXBvcnQtc2VydmljZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBQ2pELHlDQUF5QztBQUN6Qyx5REFBeUQ7QUFDekQsb0VBQW9FO0FBQ3BFLDZCQUE2QjtBQUU3QiwyQ0FBMkM7QUFFM0MsTUFBYSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDJCQUEyQjtRQUMzQixNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN2RCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsdUJBQXVCO1NBQ2xFLENBQUMsQ0FBQztRQUVILHdEQUF3RDtRQUN4RCxNQUFNLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDekUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsNEJBQTRCO1lBQ3JDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM5RCxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLFlBQVksQ0FBQyxVQUFVO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTFDLDRFQUE0RTtRQUM1RSxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNwRCxXQUFXLEVBQUUsa0JBQWtCO1lBQy9CLFdBQVcsRUFBRSxnREFBZ0Q7U0FDOUQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUU7WUFDbkYsb0JBQW9CLEVBQUU7Z0JBQ3BCO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixrQkFBa0IsRUFBRTt3QkFDbEIsb0RBQW9ELEVBQUUsS0FBSztxQkFDNUQ7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsRUFBRTtZQUNGLGVBQWUsRUFBRTtnQkFDZjtvQkFDRSxVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLG9EQUFvRCxFQUFFLElBQUk7cUJBQzNEO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxnRUFBZ0U7UUFDaEUsY0FBYyxDQUFDLGdCQUFnQixDQUFDO1lBQzlCLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDekMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3RCLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDckUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM5RCxXQUFXLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLFlBQVksQ0FBQyxVQUFVO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXpDLFlBQVksQ0FBQyxvQkFBb0IsQ0FDL0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQzNCLElBQUksZUFBZSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLEVBQ3ZELEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUN4QixDQUFDO1FBRUYsNEJBQTRCO1FBQzVCLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDekQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQztZQUN6QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQztTQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVKLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdkQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztZQUM3RCxTQUFTLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQztTQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQXBGRCxnREFvRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGFwaUdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgczNOb3RpZmljYXRpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1ub3RpZmljYXRpb25zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcblxuZXhwb3J0IGNsYXNzIEltcG9ydFNlcnZpY2VTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFN0ZXAgMTogQ3JlYXRlIFMzIEJ1Y2tldFxuICAgIGNvbnN0IGltcG9ydEJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0ltcG9ydEJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIEZvciBkZXZlbG9wbWVudCBvbmx5XG4gICAgfSk7XG5cbiAgICAvLyBTdGVwIDI6IERlZmluZSB0aGUgaW1wb3J0UHJvZHVjdHNGaWxlIExhbWJkYSBmdW5jdGlvblxuICAgIGNvbnN0IGltcG9ydFByb2R1Y3RzRmlsZSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0ltcG9ydFByb2R1Y3RzRmlsZScsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgaGFuZGxlcjogJ2ltcG9ydFByb2R1Y3RzRmlsZS5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGFtYmRhJykpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQlVDS0VUX05BTUU6IGltcG9ydEJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGltcG9ydEJ1Y2tldC5ncmFudFB1dChpbXBvcnRQcm9kdWN0c0ZpbGUpO1xuXG4gICAgLy8gU3RlcCAzOiBEZWZpbmUgQVBJIEdhdGV3YXkgd2l0aCBDT1JTIGhhbmRsZWQgbWFudWFsbHkgbGlrZSBQcm9kdWN0U2VydmljZVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlHYXRld2F5LlJlc3RBcGkodGhpcywgJ0ltcG9ydEFwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnSW1wb3J0U2VydmljZUFQSScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgc2VydmljZSBoYW5kbGVzIGZpbGUgaW1wb3J0cyBhbmQgcGFyc2luZy4nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1wb3J0UmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnaW1wb3J0Jyk7XG5cbiAgICBpbXBvcnRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGltcG9ydFByb2R1Y3RzRmlsZSwge1xuICAgICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSwge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBBbHNvIGFkZCBDT1JTIHByZWZsaWdodCBmb3IgR0VUIChsaWtlIGluIFByb2R1Y3RTZXJ2aWNlU3RhY2spXG4gICAgaW1wb3J0UmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICBhbGxvd09yaWdpbnM6IGFwaUdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgIGFsbG93TWV0aG9kczogWydHRVQnXSxcbiAgICB9KTtcblxuICAgIC8vIFN0ZXAgNDogRGVmaW5lIHRoZSBpbXBvcnRGaWxlUGFyc2VyIExhbWJkYVxuICAgIGNvbnN0IGltcG9ydEZpbGVQYXJzZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdJbXBvcnRGaWxlUGFyc2VyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBoYW5kbGVyOiAnaW1wb3J0RmlsZVBhcnNlci5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGFtYmRhJykpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQlVDS0VUX05BTUU6IGltcG9ydEJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGltcG9ydEJ1Y2tldC5ncmFudFJlYWQoaW1wb3J0RmlsZVBhcnNlcik7XG5cbiAgICBpbXBvcnRCdWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oXG4gICAgICBzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsXG4gICAgICBuZXcgczNOb3RpZmljYXRpb25zLkxhbWJkYURlc3RpbmF0aW9uKGltcG9ydEZpbGVQYXJzZXIpLFxuICAgICAgeyBwcmVmaXg6ICd1cGxvYWRlZC8nIH1cbiAgICApO1xuXG4gICAgLy8gU3RlcCA1OiBHcmFudCBwZXJtaXNzaW9uc1xuICAgIGltcG9ydFByb2R1Y3RzRmlsZS5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0J10sXG4gICAgICByZXNvdXJjZXM6IFtgJHtpbXBvcnRCdWNrZXQuYnVja2V0QXJufS8qYF0sXG4gICAgfSkpO1xuXG4gICAgaW1wb3J0RmlsZVBhcnNlci5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6Q29weU9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcbiAgICAgIHJlc291cmNlczogW2Ake2ltcG9ydEJ1Y2tldC5idWNrZXRBcm59LypgXSxcbiAgICB9KSk7XG4gIH1cbn1cbiJdfQ==