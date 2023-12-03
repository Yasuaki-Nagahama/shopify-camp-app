import {
  Banner,
  reactExtension,
  DatePicker,
  View,
  BlockStack,
} from '@shopify/ui-extensions-react/checkout';
import { useState, useCallback } from "react";

export default reactExtension(
  'purchase.checkout.shipping-option-list.render-before',
  () => <Extension />,
);

function Extension() {
  const [date, setDate] = useState("");
  const handleChange = useCallback(
    (newValue: string) => setDate(newValue),
    [],
  );

  return (
    <BlockStack>
    <View padding="base" border="base">
      <Banner
        status="success"
        title="Please select any desired delivery date"
      />
      </View>
      <View padding="base" border="base">
        <DatePicker selected={date} onChange={handleChange} />
      </View>
      </BlockStack>
  );
}