defmodule ExamplePhxWeb.Router do
  use ExamplePhxWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ExamplePhxWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index

    # Hacky demo auth system
    get "/login", PageController, :login
    get "/logout", PageController, :logout

    # Thesis dynamic (db-only) pages
    # Should always be last!
    get "/*path", PageController, :dynamic
  end

  # Other scopes may use custom stacks.
  # scope "/api", ExamplePhxWeb do
  #   pipe_through :api
  # end
end
