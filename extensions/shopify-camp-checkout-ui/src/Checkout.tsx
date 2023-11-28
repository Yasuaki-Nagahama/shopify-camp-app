import {
  Banner,
  reactExtension,
  TextField,
  View,
  BlockStack
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  return (
    <BlockStack>
    <View padding="base" border="base">
      <Banner
        status="critical"
        title="Your payment details couldn’t be verified. Check your card details and try again."
      />
      </View>
      <View padding="base" border="base">
        <TextField label='last name'></TextField>
      </View>
      </BlockStack>
  );
}