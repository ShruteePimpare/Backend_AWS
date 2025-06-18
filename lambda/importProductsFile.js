"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3();
async function handler(event) {
    const fileName = event.queryStringParameters?.fileName;
    if (!fileName) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'fileName query parameter is required',
            }),
            headers: {
                'Access-Control-Allow-Origin': '*', // or restrict to your domain
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS', // add POST, PUT etc. if needed
            },
        };
    }
    const bucketName = process.env.BUCKET_NAME;
    const s3Key = `uploaded/${fileName}`;
    // Generate a signed URL for uploading the file
    const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: s3Key,
        Expires: 60 * 5, // URL is valid for 5 minutes
        ContentType: 'application/octet-stream',
    });
    return {
        statusCode: 200,
        body: JSON.stringify({
            signedUrl,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*', // or restrict to your domain
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, OPTIONS', // add POST, PUT etc. if needed
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0UHJvZHVjdHNGaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW1wb3J0UHJvZHVjdHNGaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMEJBdUNDO0FBM0NELHFDQUE2QjtBQUU3QixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsRUFBRSxDQUFDO0FBRWIsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFVO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUM7SUFFdkQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsT0FBTztZQUNMLFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxzQ0FBc0M7YUFDaEQsQ0FBQztZQUNGLE9BQU8sRUFBRTtnQkFDUCw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsNkJBQTZCO2dCQUNqRSw4QkFBOEIsRUFBRSxjQUFjO2dCQUM5Qyw4QkFBOEIsRUFBRSxjQUFjLEVBQUUsK0JBQStCO2FBQ2hGO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUMzQyxNQUFNLEtBQUssR0FBRyxZQUFZLFFBQVEsRUFBRSxDQUFDO0lBRXJDLCtDQUErQztJQUMvQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtRQUM3QyxNQUFNLEVBQUUsVUFBVTtRQUNsQixHQUFHLEVBQUUsS0FBSztRQUNWLE9BQU8sRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLDZCQUE2QjtRQUM5QyxXQUFXLEVBQUUsMEJBQTBCO0tBQ3hDLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTCxVQUFVLEVBQUUsR0FBRztRQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ25CLFNBQVM7U0FDVixDQUFDO1FBQ0YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLDZCQUE2QjtZQUNqRSw4QkFBOEIsRUFBRSxjQUFjO1lBQzlDLDhCQUE4QixFQUFFLGNBQWMsRUFBRSwrQkFBK0I7U0FDaEY7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFMzIH0gZnJvbSAnYXdzLXNkayc7XG5cbmNvbnN0IHMzID0gbmV3IFMzKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBhbnkpIHtcbiAgY29uc3QgZmlsZU5hbWUgPSBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnM/LmZpbGVOYW1lO1xuXG4gIGlmICghZmlsZU5hbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzQ29kZTogNDAwLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXNzYWdlOiAnZmlsZU5hbWUgcXVlcnkgcGFyYW1ldGVyIGlzIHJlcXVpcmVkJyxcbiAgICAgIH0pLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLCAvLyBvciByZXN0cmljdCB0byB5b3VyIGRvbWFpblxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdDb250ZW50LVR5cGUnLFxuICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdHRVQsIE9QVElPTlMnLCAvLyBhZGQgUE9TVCwgUFVUIGV0Yy4gaWYgbmVlZGVkXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjb25zdCBidWNrZXROYW1lID0gcHJvY2Vzcy5lbnYuQlVDS0VUX05BTUU7XG4gIGNvbnN0IHMzS2V5ID0gYHVwbG9hZGVkLyR7ZmlsZU5hbWV9YDtcblxuICAvLyBHZW5lcmF0ZSBhIHNpZ25lZCBVUkwgZm9yIHVwbG9hZGluZyB0aGUgZmlsZVxuICBjb25zdCBzaWduZWRVcmwgPSBzMy5nZXRTaWduZWRVcmwoJ3B1dE9iamVjdCcsIHtcbiAgICBCdWNrZXQ6IGJ1Y2tldE5hbWUsXG4gICAgS2V5OiBzM0tleSxcbiAgICBFeHBpcmVzOiA2MCAqIDUsIC8vIFVSTCBpcyB2YWxpZCBmb3IgNSBtaW51dGVzXG4gICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzaWduZWRVcmwsXG4gICAgfSksXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJywgLy8gb3IgcmVzdHJpY3QgdG8geW91ciBkb21haW5cbiAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6ICdHRVQsIE9QVElPTlMnLCAvLyBhZGQgUE9TVCwgUFVUIGV0Yy4gaWYgbmVlZGVkXG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==