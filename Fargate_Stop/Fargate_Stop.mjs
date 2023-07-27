import { ECSClient, UpdateServiceCommand } from "@aws-sdk/client-ecs"; // ES Modules import

const ecsRegion = "ca-central-1"; // event.ECS_REGION.toLowerCase();
const client = new ECSClient({region: ecsRegion});

export const handler = async (event, context) => {
  
  console.info("EVENT\n" + JSON.stringify(event, null, 2))
  
  const updateServiceParams = {
    cluster: event.ECS_CLUSTER,
    service: event.ECS_SERVICE_NAME,
    desiredCount: Number("0"), // (event.status.toLowerCase() == 'start' ? 1 : 0),
  };

  const command = new UpdateServiceCommand(updateServiceParams);
  
  try {
    await client.send(command);
  } catch(err) {
    console.log(err);
  }
};