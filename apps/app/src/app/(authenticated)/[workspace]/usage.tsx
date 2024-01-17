import { Card } from "@floe/ui";
import { Flex, MarkerBar, Text } from "@tremor/react";

export function Usage() {
  return (
    <Card className="max-w-sm" title="Usage">
      <Flex>
        <Text>$ 9,012 &bull; 45%</Text>
        <Text>$ 20,000</Text>
      </Flex>
      <MarkerBar
        value={45}
        minValue={25}
        maxValue={65}
        color="yellow"
        className="mt-4"
      />
    </Card>
  );
}
