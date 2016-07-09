defmodule Thesis.Auth do
  @moduledoc """
  Thesis.Auth is an Elixir "behaviour" that defines the public function
  interface necessary for Thesis to determine whether the current session
  has the authority to edit.

  There is only one required functions, as described below.

  Ensure that your app specifies the proper module in your configuration options.
  For example, in `config/config.ex`:

      config :thesis,
        store: Thesis.EctoStore,
        authorization: MyApp.ThesisAuth
      config :thesis, Thesis.EctoStore, repo: MyApp.Repo
  """

  @doc """
  Returns true/false, whether a page is editable or not. Used to determine
  whether to load and display the Thesis editor and also whether to allow
  updates to Thesis.Page and Thesis.PageContent areas.

  Typical example:

      defmodule MyApp.ThesisAuth do
        @behaviour Thesis.Auth

        def page_is_editable?(conn) do
          conn
          |> MyApp.AuthController.current_user_is_admin?(conn)
        end
      end
  """
  @callback page_is_editable?(Plug.Conn.t) :: boolean
end
