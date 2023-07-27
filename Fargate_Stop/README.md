# Fargate_Stop
### About
---
This folder holds the Lambda script, and supporting information to configure EventBridge/CloudWatch event(s) to run the Lambda.  This script particularly deals with turning off an Fargate [container] cluster, but can be expanded to turn the cluster on.

Per default security policy, the Lambda function and EventBridge/CloudWatch will need to be setup in the same project set/space as the Aurora cluster.

### Table of Contents
---
1. [Prerequisites](#prerequisites)
4. [Setup the Lambda function](#setup-the-lambda-function)
5. [Set IAM Policy to allow updating ECS](#set-iam-policy-to-allow-updating-ecs)
6. [EventBridge (nee CloudWatch) Event Configuration](#eventbridge-nee-cloudwatch-event-configuration)

### Prerequisites
---
Access to AWS Project set(s)/space(s).  Please use the following URL to login: https://login.nimbus.cloud.gov.bc.ca/api Login failure is anticipated; it’s the log entry that the CITZ Cloud Pathfinder team will use to create what is needed.

:memo: **INFO**: Turnaround is quick, generally inside of 24 hours.  Try before following up. 

### Setup the Lambda function
---
FYI: This Lambda script uses Node.js 18.x, and aws-sdk v3.

1. **Lambda > Create function** button, fill out the following details:
   - Function name: **Fargate_Stop**
   - Runtime: **Node.js 18.x**
2. Click the **Create function** button (bottom left)
2. Select the **Code** tab
3. Paste code from the supplied .mjs file in this folder
4. Click the **Deploy** button to save work

:arrow_up: [Back to Top](#table-of-contents)

### Set IAM Policy to allow updating ECS
---
While still in the Lambda function details -

3. **Configuration > Permissions**
4. Click role hyperlink to open IAM policies & permissions screen
5. Click the policy hyperlink
6. Click the **Edit** button
7. Click the **+ Add new statement** button
   - Overwrite with: 
   ```json
   {
     "Effect": "Allow",
     "Action": "ecs:UpdateService",
     "Resource": "*"
   }
   ```
8. Click the **Next** button
9. Click **Save changes** button
10. Confirm RDS is a resource for the Lambda function
    - **Lambda > Functions > Fargate_Stop**
    - **Configuration > Permissions**
    - Resource Summary, select **Amazon Elastic Container Service**
    - Confirm Actions match what was set in Step 2, #6

:arrow_up: [Back to Top](#table-of-contents)

### EventBridge (nee CloudWatch) Event Configuration
---

1. Open **CloudWatch** for the appropriate AWS Project set/space (eg -”tools”)
2. Click **Rules** (leftside nav)
3. Click **Create rule** button
   - Select **Schedule** radio button
   - Specify **CRON expression**, eg `0 0 ? * 2-5 *` for every Mon-Fri, at 5 PM.  Confirm the trigger dates shown are correct/expected.  
       :memo: **INFO**: Pay this section close attention - the time defaults to UTC not local (which is 17 hours ahead of PST), and the “2-5” setting will go into effect the next full week (not the current week).
4. Click the **+ Add target** button
   - Select/set Lambda function (if not already)
   - Select/set the Function to be run (eg Aurora_Stop)
   - Expand Configure input (or “Additional settings”, depends on the UI)
   - Select Constant (JSON text) radio button
   - Specify parameter(s) eg 
      ```json 
     {"ECS_CLUSTER":"your_cluster", "ECS_SERVICE_NAME":"your-dev-service"}
      ```    
     :memo: **INFO**: Check your work with a JSON formatter (eg [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/)), as I was unable to set the parameters because of improper double quotes. Thankfully, the formatter fixed automatically.
5. Click the **Configure details** button
6. Specify rule **Name**, description is optional
7. Click the **Create rule** button

The newly created rule should show in the list of CloudWatch > Rules

:arrow_up: [Back to Top](#table-of-contents)
