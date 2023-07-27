import botocore
import boto3

def stopRDS(rdsId):
    rds = boto3.client('rds')
    instances = rds.describe_db_clusters(DBClusterIdentifier = rdsId)

    status = instances.get('DBClusters')[0].get('Status')

    if status == 'available':    
        resp = rds.stop_db_cluster(DBClusterIdentifier = rdsId)
        print('Requested to stop rds: ' + str(rdsId))  
    else:
        print('RDS ' + str(rdsId) + ' is ' + str(status))

def lambda_handler(event, context):
    rdsId = event['AURORA_CLUSTER'] # Aurora Cluster name, provided via EventBridge/CloudWatch event
    stopRDS(rdsId)
    return 'Stopped environment.'