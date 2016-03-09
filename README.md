# Thesis

Thesis is an Elixir/Phoenix hex package for quickly and easily adding content
editing to any page.

It's inspired by the [Rails gem](https://github.com/infinitered/thesis-rails) by
the same name and author.

![2016-03-05-enu58](https://cloud.githubusercontent.com/assets/1479215/13549778/137ec256-e2c2-11e5-8c6e-7cd653cbd52b.gif)

## Installation and Configuration

_If you are having problems, view `README_INSTALL.md` for manual instructions._

#### 1. Add thesis to your `mix.exs`:

```elixir
def deps do
  [{:thesis, "~> 0.0.7"}]
end

def application do
  [applications: [:thesis]]
end
```

#### 2. Run `mix thesis.install`

This install script will add Thesis to your `config.exs` and `web.ex`, as well
as generate a migration and an authorization module in `lib/thesis_auth.ex`.

#### 3. Add the Thesis editor to your layout

```eex
  <body>
    <%= thesis_editor(@conn) %>
```

#### 4. Run `mix ecto.migrate`

```
$ mix ecto.migrate
```

## Making Pages Editable

Use the `Thesis.View.content/4` view helper function to make a content area
editable. If you added `use Thesis.View` in your `web.ex` file, this function
is already available on all of your views.

Thesis will add a wrapper `<div>` around editable HTML and plain-text content
areas.

### Rich Text Areas

Simply wrap your HTML in a `content` function call.

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

## Authorization

You probably don't want your website editable by the world. Thesis doesn't
force you to use any particular authorization strategy. Instead, Thesis will
call your auth module's `can_edit_page?/1` function and provide the current
`conn`, which can be used to extract current user session data, the current
page, and then decide on your own how that should affect authorization.

Here's an example which we use on our own website, [https://infinite.red](https://infinite.red):

```elixir
defmodule IrWebsite.ThesisAuth do
  def page_is_editable?(conn) do
    !!IrWebsite.AuthController.current_user(conn)
  end
end
```

In our `auth_controller.ex` file, the `current_user/1` function looks like this:

```elixir
  def current_user(conn) do
    get_session(conn, :current_user)
  end
```

So, in this case, we're simply checking to see if the user has been logged in
or not. Since we're verifying their identity before letting them log in,
it's safe for us to assume that if they're logged in, they have permission to
edit the page.

## What Thesis Isn't

You can't have it all. Thesis isn't the same as other -bloated- full-functional content management systems out there. This is a list of what it's not now and
not likely to be in the future.

_We reserve the right to change our mind, however. :-)_

* Not a WordPress Replacement
* Not a full featured CMS
* Not a full featured WYSIWYG editor
* Not an authentication or permission system
* Not a library that works well outside of Phoenix


## Contributing

We're committed to making Thesis the go-to content editing system for Phoenix
websites. Please help us improve!

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Write tests for your new feature
5. Run `rake spec` in the root directory to ensure that all tests pass.
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

### Key Contributors

* Jamon Holmgren [@jamonholmgren](https://twitter.com/jamonholmgren)
* Ken Miller [@seriousken](https://github.com/kemiller)
* Daniel Berkompas [@dberkom](https://twitter.com/dberkom)

Also supported by others on the [Infinite Red](https://infinite.red) team.

### License

Copyright (c) 2016 Infinite Red, Inc.

Thesis depends on Elixir, which is under the Apache 2 license, and
Phoenix, which is also MIT.

See LICENSE.md for more information.
