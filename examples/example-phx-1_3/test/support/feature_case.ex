defmodule ExamplePhxWeb.FeatureCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Wallaby.DSL

      alias ExamplePhx.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import ExamplePhxWeb.Router.Helpers
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(ExamplePhx.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(ExamplePhx.Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(ExamplePhx.Repo, self())
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    {:ok, session: session}
  end
end
