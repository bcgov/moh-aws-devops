# Aurora_Stop
### About
---
This folder holds the Lambda script, and supporting information to configure EventBridge/CloudWatch event(s) to run the Lambda.  This script particularly deals with turning off an Aurora cluster, but can be expanded to turn the cluster on.

Per default security policy, the Lambda function and EventBridge/CloudWatch will need to be setup in the same project set/space as the Aurora cluster.

### Table of Contents
---
1. [Prerequisites](#prerequisites)
2. [Create an IAM Policy](#create-an-iam-policy)
3. [Create the IAM Role](#create-the-iam-role)
4. [Setup the Lambda function](#setup-the-lambda-function)
5. [Update the Lambda function](#update-the-lambda-function)
6. [EventBridge (nee CloudWatch) Event Configuration](#eventbridge-nee-cloudwatch-event-configuration)

### Prerequisites
---
Access to AWS Project set(s)/space(s).  Please use the following URL to login: https://login.nimbus.cloud.gov.bc.ca/api Login failure is anticipated; it’s the log entry that the CITZ Cloud Pathfinder team will use to create what is needed.

:memo: **INFO**: Turnaround is quick, generally inside of 24 hours.  Try before following up. 

### Create an IAM Policy
---
Create the IAM policy, to be attached to an IAM Role…

1. Log into AWS: https://login.nimbus.cloud.gov.bc.ca/api 
2. Select appropriate location (eg AWS project set “-tools”)
3. Select **IAM**
4. Click the **Policies > Create Policy** button
5. Click **JSON** button (upper right corner)
6. Paste/recreate the following (FYI: rds covers both RDS and Aurora)
   ```json
   {
    "Version": "2012-10-17",
    "Statement": [
        {           
            "Effect": "Allow",
            "Action": [
                "rds:DescribeDBInstances",
                "rds:DescribeDBClusters",
                "rds:StopDBInstance",
                "rds:StartDBInstance",
                "rds:StopDBCluster",
                "rds:StartDBCluster"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
   }
   ```
7. Click the **Next** button
8. Provide a policy name e.g., policy-start-stop-rds-aurora
9. Click the **Create policy** button

:arrow_up: [Back to Top](#table-of-contents)

### Create the IAM Role
---
While still in IAM (from previous section):

1. **Roles > Create role** button
2. Fill out “Select trusted entity”:
   - Trusted entity type: **AWS Services**
   - Use case: **Lambda**
3. Click the **Next** button
4. Associate the policy created earlier with the role:
   - In the Search bar, search for **policy_[created in previous Step]**
   - Check the box for the policy
5. Click the **Next** button
6. Provide a descriptive role name (e.g, **lambda-start-stop-rds-aurora**)
7. Click **Create Role**.

:arrow_up: [Back to Top](#table-of-contents)

### Setup the Lambda function
---
Time to create the Lambda function!

1. **Lambda > Create function** button, fill out the following details:
   - Function name: **Aurora_Stop**
   - Runtime: **Python [latest]**
   - Expand **Change default execution role** section
   - Select **Use an existing role**
   - Select role name created during Step 2 from Existing role dropdown.  Search for if you need to.
2. Click the **Create function** button (bottom left)
3. **Configuration > Permissions**
4. Click role hyperlink to open IAM policies & permissions screen
5. Expand **policy_[created in Step 1]**
6. Click the **Edit** button
7. Click the **+ Add new statement** button
   - Overwrite with: 
   ```json
   {
      "Effect": "Allow",
      "Action": "lambda:GetFunctionConfiguration",
      "Resource": "<Lambda ARN>"
   }
   ```
   - Copy the ARN from the Lambda function (created at the start of Step 3), using the **Copy ARN** button (top left corner)
   - Paste the Lambda ARN into the Resource section, within the double quotes shown in the sample/example (7a)
8. Click the **Next** button
9. Click **Save changes** button
10. Confirm RDS is a resource for the Lambda function
    - **Lambda > Functions > Aurora_Stop**
    - **Configuration > Permissions**
    - Resource Summary, select **Amazon RDS**
    - Confirm Actions match what was set in Step 1, #6

:arrow_up: [Back to Top](#table-of-contents)

### Update the Lambda function
---
Now that the function is configured, time to paste the code:

1. **Lambda > Functions > Aurora_Stop**
2. Select the **Code** tab
3. Paste code from the supplied .py file in this folder
4. Click the **Deploy** button to save work

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
     {"AURORA_CLUSTER": "yourClusterName"}
      ```    
     :memo: **INFO**: Check your work with a JSON formatter (eg [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/)), as I was unable to set the parameters because of improper double quotes. Thankfully, the formatter fixed automatically.
5. Click the **Configure details** button
6. Specify rule **Name**, description is optional
7. Click the **Create rule** button

The newly created rule should show in the list of CloudWatch > Rules

:arrow_up: [Back to Top](#table-of-contents)
