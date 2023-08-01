[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](<Redirect-URL>)

This repo holds Lambda scripts for turning off services (eg AWS Fargate [containers], AWS Aurora [databases]) to save money (eg dev, test environments that don't need to be operational all the time).

# Table of Contents
1. [Cross-account and Cross-region Events](#cross-account-and-cross-region-events)
2. [Aurora_Stop](#aurora_stop)
2. [Fargate_Stop](#fargate_stop)

# Cross-account and Cross-region Events
By default, Lambda/CloudWatch/EventBridge will only execute with the same project set/space.  In order to centralize/consolidate the Lambda and CloudWatch/EventBridge, the architecture requires three accounts:
* *AccountA*: the source event account with a Lambda function that sends events.
* *AccountGlobal*: the account hosting the global Event bus and forwarding rule to the target account.
* *AccountB*: the target event account containing our target workload, a Lambda function.

![](https://repost.aws/media/postImages/original/IMYuZvA02yQTSTN46OiskjGA)

The flow has four steps:

1. EventSender Lambda is triggered.
2. EventSender Lambda sends an event towards the global event bus.
3. Global event bus forwards the event to a target event bus.
4. The target event bus forwards the event to Event Receiver Lambda.

Step-by-step instructions: https://repost.aws/articles/ARIw6q_ozaTmqqI25Eq4YIcQ/a-step-by-step-guide-to-cross-account-and-cross-region-events-with-eventbridge

:arrow_up: [Back to Top](#table-of-contents)

# Aurora_Stop
This script takes arguments via CloudWatch/EventBridge:
* AURORA_CLUSTER

:arrow_up: [Back to Top](#table-of-contents)

# Fargate_Stop
This script takes arguments via CloudWatch/EventBridge:
* ECS_CLUSTER
* ECS_SERVICE_NAME

:arrow_up: [Back to Top](#table-of-contents)
