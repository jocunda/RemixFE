import {
  Form,
  Links,
  Link,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import appStylesHref from "./app.css";
import styles from "./tailwind.css"
import { json, redirect } from "@remix-run/node";
import { useEffect } from "react";

import { createEmptyitem, getItems } from "./data";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(appStylesHref ? [{ rel: "stylesheet", href: appStylesHref }] : []),
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const items = await getItems(q);
  return json({ items, q });
};

export const action = async () => {
  const item = await createEmptyitem();
  return redirect(`/items/${item.id}/edit`);
};


export default function App() {
  const { items, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search">
              <input
                id="q"
                defaultValue={q || ""}
                aria-label="Search items"
                placeholder="Search"
                type="search"
                name="q"
                className={searching ? "loading" : ""}
              />
              <div id="search-spinner" hidden={!searching} aria-hidden />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <Link to="/items">Item</Link>
          <nav>
            {items.length ? (
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`item/${item.id}`}
                    >
                      {item.first || item.last ? (
                        <>
                          {item.first} {item.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {item.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No items</i>
              </p>
            )}
          </nav>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <div id="detail" className={
          navigation.state === "loading" && !searching
            ? "loading"
            : ""
        }>
          <Outlet />
        </div>
      </body>
    </html>
  );
}
