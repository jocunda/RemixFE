import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData
} from "@remix-run/react";
import type { FunctionComponent } from "react";

import { getitem, updateitem } from "../data";

import type { itemRecord } from "../data";
import invariant from "tiny-invariant";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.itemId, "Missing itemId param");
  const item = await getitem(params.itemId);
  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ item });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.itemId, "Missing itemId param");
  const formData = await request.formData();
  return updateitem(params.itemId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function item() {
  const { item } = useLoaderData<typeof loader>();


  return (
    <div>ItemId{item.id}</div>
  );

};
