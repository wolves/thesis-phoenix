ExUnit.start()

Ecto.Adapters.SQL.Sandbox.mode(ExamplePhx.Repo, :manual)
<<<<<<< HEAD
=======

Application.put_env(:wallaby, :base_url, ExamplePhxWeb.Endpoint.url)

{:ok, _} = Application.ensure_all_started(:wallaby)
>>>>>>> WIP
