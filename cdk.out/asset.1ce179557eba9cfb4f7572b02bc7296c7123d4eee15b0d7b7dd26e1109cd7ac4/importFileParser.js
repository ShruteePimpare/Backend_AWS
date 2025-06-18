"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const aws_sdk_1 = require("aws-sdk");
const csvParser = require("csv-parser");
const s3 = new aws_sdk_1.S3();
async function handler(event) {
    const record = event.Records[0]; // We can assume there will only be one record in the event
    const s3Bucket = record.s3.bucket.name;
    const s3Key = record.s3.object.key;
    console.log(`Processing file: ${s3Key} from bucket: ${s3Bucket}`);
    try {
        // Get the file from S3
        const s3Object = await s3.getObject({
            Bucket: s3Bucket,
            Key: s3Key,
        }).promise();
        // Stream the file content to the CSV parser
        const fileStream = s3Object.Body;
        const records = [];
        // Parse the CSV file
        fileStream.pipe(csvParser())
            .on('data', (data) => {
            console.log('Parsed record:', data);
            records.push(data);
        })
            .on('end', async () => {
            console.log('CSV Parsing completed, records:', records);
            // Move the file from 'uploaded/' folder to 'parsed/' folder
            const newS3Key = s3Key.replace('uploaded/', 'parsed/');
            await s3.copyObject({
                Bucket: s3Bucket,
                CopySource: `${s3Bucket}/${s3Key}`,
                Key: newS3Key,
            }).promise();
            // Delete the original file from 'uploaded/' folder
            await s3.deleteObject({
                Bucket: s3Bucket,
                Key: s3Key,
            }).promise();
            console.log(`File moved to parsed folder: ${newS3Key}`);
        });
    }
    catch (error) {
        console.error(`Error processing file ${s3Key}:`, error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0RmlsZVBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltcG9ydEZpbGVQYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSwwQkE4Q0M7QUFwREQscUNBQTZCO0FBQzdCLHdDQUF3QztBQUd4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsRUFBRSxDQUFDO0FBRWIsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFVO0lBQ3RDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyREFBMkQ7SUFDNUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUVuQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixLQUFLLGlCQUFpQixRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLElBQUksQ0FBQztRQUNILHVCQUF1QjtRQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDbEMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsR0FBRyxFQUFFLEtBQUs7U0FDWCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFYiw0Q0FBNEM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQW1CLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQVUsRUFBRSxDQUFDO1FBRTFCLHFCQUFxQjtRQUNyQixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3pCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLElBQUksRUFBRTtZQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXhELDREQUE0RDtZQUM1RCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN2RCxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ2xCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUUsR0FBRyxRQUFRLElBQUksS0FBSyxFQUFFO2dCQUNsQyxHQUFHLEVBQUUsUUFBUTthQUNkLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUViLG1EQUFtRDtZQUNuRCxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixHQUFHLEVBQUUsS0FBSzthQUNYLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUViLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEtBQUssR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUzMgfSBmcm9tICdhd3Mtc2RrJztcbmltcG9ydCAqIGFzIGNzdlBhcnNlciBmcm9tICdjc3YtcGFyc2VyJztcbmltcG9ydCB7IFBhc3NUaHJvdWdoIH0gZnJvbSAnc3RyZWFtJztcblxuY29uc3QgczMgPSBuZXcgUzMoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IGFueSkge1xuICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdOyAvLyBXZSBjYW4gYXNzdW1lIHRoZXJlIHdpbGwgb25seSBiZSBvbmUgcmVjb3JkIGluIHRoZSBldmVudFxuICBjb25zdCBzM0J1Y2tldCA9IHJlY29yZC5zMy5idWNrZXQubmFtZTtcbiAgY29uc3QgczNLZXkgPSByZWNvcmQuczMub2JqZWN0LmtleTtcblxuICBjb25zb2xlLmxvZyhgUHJvY2Vzc2luZyBmaWxlOiAke3MzS2V5fSBmcm9tIGJ1Y2tldDogJHtzM0J1Y2tldH1gKTtcblxuICB0cnkge1xuICAgIC8vIEdldCB0aGUgZmlsZSBmcm9tIFMzXG4gICAgY29uc3QgczNPYmplY3QgPSBhd2FpdCBzMy5nZXRPYmplY3Qoe1xuICAgICAgQnVja2V0OiBzM0J1Y2tldCxcbiAgICAgIEtleTogczNLZXksXG4gICAgfSkucHJvbWlzZSgpO1xuXG4gICAgLy8gU3RyZWFtIHRoZSBmaWxlIGNvbnRlbnQgdG8gdGhlIENTViBwYXJzZXJcbiAgICBjb25zdCBmaWxlU3RyZWFtID0gczNPYmplY3QuQm9keSBhcyBQYXNzVGhyb3VnaDtcbiAgICBjb25zdCByZWNvcmRzOiBhbnlbXSA9IFtdO1xuXG4gICAgLy8gUGFyc2UgdGhlIENTViBmaWxlXG4gICAgZmlsZVN0cmVhbS5waXBlKGNzdlBhcnNlcigpKVxuICAgICAgLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1BhcnNlZCByZWNvcmQ6JywgZGF0YSk7XG4gICAgICAgIHJlY29yZHMucHVzaChkYXRhKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NTViBQYXJzaW5nIGNvbXBsZXRlZCwgcmVjb3JkczonLCByZWNvcmRzKTtcblxuICAgICAgICAvLyBNb3ZlIHRoZSBmaWxlIGZyb20gJ3VwbG9hZGVkLycgZm9sZGVyIHRvICdwYXJzZWQvJyBmb2xkZXJcbiAgICAgICAgY29uc3QgbmV3UzNLZXkgPSBzM0tleS5yZXBsYWNlKCd1cGxvYWRlZC8nLCAncGFyc2VkLycpO1xuICAgICAgICBhd2FpdCBzMy5jb3B5T2JqZWN0KHtcbiAgICAgICAgICBCdWNrZXQ6IHMzQnVja2V0LFxuICAgICAgICAgIENvcHlTb3VyY2U6IGAke3MzQnVja2V0fS8ke3MzS2V5fWAsXG4gICAgICAgICAgS2V5OiBuZXdTM0tleSxcbiAgICAgICAgfSkucHJvbWlzZSgpO1xuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgb3JpZ2luYWwgZmlsZSBmcm9tICd1cGxvYWRlZC8nIGZvbGRlclxuICAgICAgICBhd2FpdCBzMy5kZWxldGVPYmplY3Qoe1xuICAgICAgICAgIEJ1Y2tldDogczNCdWNrZXQsXG4gICAgICAgICAgS2V5OiBzM0tleSxcbiAgICAgICAgfSkucHJvbWlzZSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBGaWxlIG1vdmVkIHRvIHBhcnNlZCBmb2xkZXI6ICR7bmV3UzNLZXl9YCk7XG4gICAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwcm9jZXNzaW5nIGZpbGUgJHtzM0tleX06YCwgZXJyb3IpO1xuICB9XG59XG4iXX0=