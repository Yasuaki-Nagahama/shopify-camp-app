import { useEffect, useState, useCallback, } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Link,
  InlineStack,
  TextField,
  ResourceList,
  ResourceItem
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = String(formData.has("title") ? formData.get("title") : "");
  const searchQuery = title != "" ? "title:*" + title + "*" : "";

  const response = await admin.graphql(
  `#graphql
    query {
      products(first: 10, reverse: true, query: "${searchQuery}") {
        edges {
          node {
            id
            title
            status
            handle
            onlineStorePreviewUrl
            resourcePublicationOnCurrentPublication {
              publication {
                name
                id
              }
              publishDate
              isPublished
            }
          }
        }
      }
    }`,
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.products,
    loadedStatus: true
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const product = actionData?.product?.edges ? actionData?.product?.edges : [];

  const loadedStatus = actionData?.loadedStatus;

  useEffect(() => {
    if (product.length != 0) {
      shopify.toast.show("Product found");
    } else if(loadedStatus){
      shopify.toast.show("Product not found");
    }
  }, [product]);

  const [title, setTitle] = useState('');

  const handleChangeTitle = useCallback(
    (newValue: string) => setTitle(newValue),
    [],
  );
  const searchProduct = () => submit({title : title}, { replace: true, method: "POST" });

  return (
    <Page>
      <ui-title-bar title="camp application page" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Search product
                  </Text>
                  <Text as="p" variant="bodyMd">
                    please inupt search item title
                  </Text>
                  <TextField
                    label="item title"
                    value={title}
                    onChange={handleChangeTitle}
                    autoComplete="off"
                    placeholder="Book"
                  />
                  </BlockStack>
                  <InlineStack gap="300">
                    <Button loading={isLoading} onClick={searchProduct}>
                      Search product
                    </Button>
                  </InlineStack>
                  {actionData?.product && (
                    <BlockStack gap="200">
                      <ResourceList
                          items={actionData.product.edges}
                          resourceName={{singular: 'product', plural: 'products'}}
                          renderItem={(item) => {
                            return(
                              <ResourceItem>
                                <Link url={item.node.onlineStorePreviewUrl} target="_blank">
                                  <Text variant="bodyMd" fontWeight="bold" as="h3" >
                                    {item.node.title}
                                  </Text>
                                </Link>
                              </ResourceItem>
                            );
                          }}
                        >
                      </ResourceList>
                    </BlockStack>
                  )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}