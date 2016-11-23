# Thesis

<p align="center">
  A CMS for Elixir/Phoenix that doesn't hijack your development workflow.
  <br/>

  <a href="https://gitter.im/infinitered/thesis-phoenix?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img src="https://badges.gitter.im/infinitered/thesis-phoenix.svg" alt="Join the chat at https://gitter.im/infinitered/thesis-phoenix"></a>
  <img src=https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat alt='js-standard-style'/>
  <a href="https://semaphoreci.com/ir/thesis-phoenix"><img alt="Build Status" src="https://semaphoreci.com/api/v1/projects/0540dbb0-887a-45dd-9190-baa19b2ca9fb/816876/badge.svg"></a>
</p>

Thesis is a lightweight and flexible Elixir/Phoenix CMS for quickly and easily
adding content editing to any page on a Phoenix website, as well as creating new
dynamically routed pages. It's ideal for either adding limited editing support to
existing Phoenix websites or building dynamic websites.

_Thesis is currently considered *Alpha-quality*, but is in production on several
websites, including [Infinite Red](https://infinite.red). The API is unstable and
changing but we are committed to providing a clear upgrade path and documentation._

_See also the Thesis [Rails gem](https://github.com/infinitered/thesis-rails)._

![screen capture on 2016-04-20 at 15-11-10 copy](https://cloud.githubusercontent.com/assets/1775841/14692261/d4734d3a-070a-11e6-866b-eebbc40e6157.gif)

## Thesis Features

* Elixir/Phoenix hex package, uses React.js for its user interface
* Lightweight, bolt-on, doesn't hijack your development workflow
* On-page rich text editing
* On-page plain text editing
* Raw HTML editing for Youtube embeds or other flexible uses
* Image URL editing, both `img` tag and `div` with background image
* Page meta title and description editing
* Easily bring your own authentication system in one tiny function
* Create new dynamic pages, delete dynamic pages

## Installation and Configuration

_If you are having problems, view `README_INSTALL.md` for manual instructions._

#### 1. Add thesis to your `mix.exs`:

```elixir
def deps do
  [{:thesis, "~> 0.0.25"}]
end

def application do
  [applications: [:thesis]]
end
```

#### 2. Run `mix thesis.install`

This install script will add Thesis to your `config.exs` and `web.ex`, as well
as generate migrations and an authorization module in your `lib/thesis_auth.ex`.

#### 3. Add the Thesis editor to your layout

```eex
  <body>
    <%= thesis_editor(@conn) %>
```

#### 4. Run `mix ecto.migrate`

```
$ mix ecto.migrate
```

## Demo App

Check out the example app in `apps/example` to see how Thesis can be implemented.
We'll keep this up to date with examples of the latest features as we develop Thesis.

## Making Pages Editable

Use the `Thesis.View.content/4` view helper function to make a content area
editable. If you have `use Thesis.View` in your `web.ex` file, this function
is already available on all of your views.

Thesis will add a wrapper `<div>` around editable HTML and plain-text content
areas, both in read mode and edit mode, so plan your CSS accordingly.

### Rich Text Areas

Simply wrap your HTML in a `content` function call, specifying `html` as the content type.

```eex
<h1>Title</h1>
<p>
  Here's my default description!
</p>
```

becomes...

```eex
<%= content(@conn, "Section identifier", :html) do %>
  <h1>Title</h1>
  <p>
    Here's my default description!
  </p>
<% end %>
```

### Plain Text Areas

For plain-text, provide a `do:` option for default text.

```eex
<h1>My Title</h1>
```

becomes...

```eex
<h1><%= content(@conn, "Title identifier", :text, do: "My Title") %></h1>
```

### Custom HTML Areas

For video embeds, iframes, and any other custom HTML, use the `:raw_html` content type:

```eex
<iframe width="560" height="315" src="https://www.youtube.com/embed/5SVLs_NN_uY" frameborder="0" allowfullscreen></iframe>
```

becomes...

```eex
<%= content(@conn, "Section identifier", :raw_html) do %>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/5SVLs_NN_uY" frameborder="0" allowfullscreen></iframe>
<% end %>
```

### Images (by URL)

You can have the user specify an image URL and display the image with the `image` content type.

```eex
<img src="http://placekitten.com/200/300">
```

becomes...

```eex
<%= content(@conn, "Image identifier", :image, alt: "My alt tag", do: "http://placekitten.com/200/300") %>
```

If you prefer to use a `div` with a background image, you can use the `background_image`
content type.

```eex
<div style="background-image: url(http://placekitten.com/200/300)"></div>
```

becomes...

```eex
<%= content(@conn, "Image identifier", :background_image, do: "http://placekitten.com/200/300") %>
```

### Image Uploads

Thesis offers support for a few different ways to handle image uploads: store files in the database,
point to an uploader/adapter inside your custom app, or use one of the prebuilt adapters.

##### Store Files in Database
For smaller websites and/or website that are hosted on the cloud, thesis offers a no-setup-required image uploader.
Files are stored in a separate table and contain all of the needed metadata (name, file type, and blobs themselves).
Keep in mind as you upload more and more files, your database will grow quickly. Don't use this for high-traffic,
content-heavy web applications. Smaller personal websites are probably fine.

To enable, add this in your config/config.exs file:

```elixir
config :thesis,
  uploader: Thesis.RepoUploader
```

##### Use Your Own Uploader Module

If you already set up file uploads in your custom app, point thesis to a module that can handle a `%Plug.Upload{}`
struct.

```elixir
config :thesis,
  uploader: <MyApp>.<CustomUploaderModule>
```

The module should have an `upload/1` function that accepts a `%Plug.Upload{}` struct. This function should return either `{:ok, "path/to/file.jpg"}` tuple with an image url or path, or `{:error, _}`. You can view
[/lib/thesis/uploaders/repo_uploader.ex](https://github.com/infinitered/thesis-phoenix/blob/master/lib/thesis/uploaders/repo_uploader.ex)
for an example.

##### Use a Prebuilt Adapter
Included in Thesis is an adapter for Ospry.io, which is a service that
offers the first 1,000 images and 1 GB of monthly download bandwidth
for free.

1. Sign up at [https://ospry.io/sign-up](https://ospry.io/sign-up)
2. Verify your email
3. Create a production subdomain (assets.example.com)
4. Add a valid credit card if you anticipate exceeding Ospry.io limits.
5. Copy your production public key to the Thesis config:

```elixir
config :thesis,
  uploader: Thesis.OspryUploader

config :thesis, Thesis.OspryUploader,
  ospry_public_key: "pk-prod-abcdefghijklmnopqrstuvwxyz0123456789"
```

That's it! Restart your server and image content areas will now contain a
file upload field.

### Global Content Areas

Content areas in Thesis are page-specific. However, if you want an editable
area that can be displayed on multiple pages, use the
`Thesis.View.global_content/4` function. Any page using that content area identifier
will display the edited content across the whole website.

```eex
<%= global_content(@conn, "Footer Text", :html) do %>
  <h4>Contact Info</h4>
  <ul>
    <li>Call us at (800) 555-1212</li>
    <li>Email us at hello@example.com.</li>
  </ul>
<% end %>
```

### Customizing the Thesis markup

Thesis adds an additional `<div>` around your editable content areas. We suggest that
you not style these divs heavily, since Thesis uses them as editors and adds its own styles
in edit-mode. However, sometimes, you need to modify that markup slightly for better presentation.
You can provide an ID and additional classes by specifying `id` and `classes`, respectively.

```eex
<%= content(@conn, "Ident", :html, id: "my-id", classes: "more classes") do %>
  <h1>Title</h1>
<% end %>
```

### Page Meta Title and Description

Thesis provides a settings tray to edit each page's title and description. In your
layout, you can output the current title and description like so:

```eex
<title><%= page_title(@conn, "Default Title") %></title>
<meta name="description" content="<%= page_description(@conn, "Default Description") %>" />
```

Some prefer to set the page title and description as assigns in their controller actions:

```eex
def about(conn, params) do
  @title = Thesis.View.page_title(conn, "About My Company")
  @description = Thesis.View.page_description(conn, "A relevant description here.")
end
```

## Dynamic Pages

Thesis supports users creating and deleting dynamically routed pages. These
differ from static pages in that they are routed by Thesis rather than Phoenix,
and live only in your database. They can be rendered with different templates.

![add new page screenshot](https://cloud.githubusercontent.com/assets/1479215/17272456/9ac06bb4-564b-11e6-8990-c7964f5ebd63.png)

To enable dynamic pages, add (or uncomment) this in your `config/config.exs` file:

```elixir
config :thesis, :dynamic_pages,
  view: <MyApp>.PageView,
  templates: ["index.html", "otherview.html"],
  not_found_view: <MyApp>.ErrorView,
  not_found_template: "404.html"
```

Replace `<MyApp>` with your app name. Use any view you want, and put any templates
contained in that view that you want to make available in the `templates` list.
These will be displayed as a drop-down to the user when they are creating the new
dynamic page.

You'll also need to make one change to your router.ex and a controller of your
choice.

```elixir
# web/router.ex
# should be added as the last route

  get "/*path", <MyApp>.PageController, :dynamic

# web/controllers/page_controller.ex (or similar)

  def dynamic(conn, _params) do
    render_dynamic(conn)
  end
```

You can pass in a default template (otherwise, it'll use the first template
option in your config) with `render_dynamic(conn, template: "index.html")`.

You can choose to make only a portion of your website support static pages by
routing more specifically. For example, if you want a blog section:

```elixir
# web/router.ex

  get "/blog/*path", <MyApp>.BlogController, :dynamic
```

## Authorization

You probably don't want your website editable by the world. Thesis doesn't
force you to use any particular authorization strategy.

Instead, Thesis will call your auth module's `page_is_editable?/1` function
and provide the current `conn`, which can be used to extract current user
session data as well as the current page, and then you can decide how that
should affect authorization.

Here's an example which we use on our own website, [https://infinite.red](https://infinite.red):

```elixir
defmodule IrWebsite.ThesisAuth do
  @behaviour Thesis.Auth

  def page_is_editable?(conn) do
    IrWebsite.AuthController.logged_in?(conn)
  end
end
```

In our `auth_controller.ex` file, the `logged_in?/1` function looks something
like this:

```elixir
  def logged_in?(conn) do
    !!current_user(conn)
  end

  def current_user(conn) do
    get_session(conn, :current_user)
  end
```

So, in this case, we're simply checking to see if the user has been logged in
or not. Since only Infinite Red employees have logins, it's safe for us to
assume that if they're logged in, they have permission to edit the page.

If you use [Guardian](https://github.com/ueberauth/guardian) or something similar,
you may need additional manipulations to your `conn` to properly authenticate the
user. Add those to your auth module like this:

```eex
defmodule MyApp.ThesisAuth do
  @moduledoc """
  Contains functions for handling Thesis authorization.
  """

  def page_is_editable?(conn) do
    conn
    |> Guardian.Plug.VerifySession.call(%{})
    |> Guardian.Plug.LoadResource.call(%{})
    |> MyApp.SessionController.logged_in_and_admin?
  end
end
```

## What Thesis Isn't

You can't have it all. Thesis isn't the same as other -bloated- full-function
content management systems out there. This is a list of what it's not now and
not likely to be in the future.

* Not a complete WordPress Replacement
* Not a full featured CMS
* Not a full featured WYSIWYG editor
* Not an authentication or permission system
* Not supported outside of a Phoenix app

## Common Issues

#### Thesis's menu/editor/tray is borked

This is pretty common. While we try to be good citizens by properly namespacing
all Thesis elements, we embed Thesis code into your existing web page, and so
we're at the mercy of your application's existing CSS.

Inspect the element(s) that are screwed up and see if any of your styles are
conflicting. For example, here's a screenshot of an issue:

[borked Thesis editor](https://cloud.githubusercontent.com/assets/1479215/18256127/223706ca-7366-11e6-971e-018ef8e656cb.png)

Note that there is a `.tooltip` CSS rule originating in a different CSS file
that is affecting our editor.

In future releases, we will namespace all Thesis classes and IDs. But if your
application is overriding whole elements (like `div` or `img`), it's up to you
to fix the issue in your own CSS.

## Contributing

We're committed to making Thesis the go-to content editing system for Phoenix
websites. Please help us improve!

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Run `brunch watch -p` during development
5. Use the `apps/example` Phoenix app to manually test your feature
6. Write tests for your new feature
7. Run `mix test && npm test` in the root directory to ensure that Thesis tests pass.
8. Run `mix test` in the `apps/example` directory to ensure the example app passes
9. Push to the branch (`git push origin my-new-feature`)
10. Create new Pull Request

### Key Contributors

* Jamon Holmgren [@jamonholmgren](https://twitter.com/jamonholmgren)
* Yulian Glukhenko [@yulianglukhenko](https://github.com/yulianglukhenko)
* Ken Miller [@seriousken](https://github.com/kemiller)
* Daniel Berkompas [@dberkom](https://twitter.com/dberkom)

Also supported by others on the [Infinite Red](https://infinite.red) team.

### License: MIT

Copyright (c) 2016 Infinite Red, Inc.

Thesis depends on Elixir, which is under the Apache 2 license, and
Phoenix, which is MIT.

See LICENSE.md for more information.
