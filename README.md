[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](<Redirect-URL>)

This repo holds Lambda scripts for turning off services (eg AWS Fargate [containers], AWS Aurora [databases]) to save money (eg dev, test environments that don't need to be operational all the time).

### Table of Contents
---
1. [Aurora_Stop](#aurora_stop)
2. [Fargate_Stop](#fargate_stop)

### Aurora_Stop
---
This script takes arguments via CloudWatch/EventBridge:
* AURORA_CLUSTER

:arrow_up: [Back to Top](#table-of-contents)

### Fargate_Stop
---
This script takes arguments via CloudWatch/EventBridge:
* ECS_CLUSTER
* ECS_SERVICE_NAME

:arrow_up: [Back to Top](#table-of-contents)
