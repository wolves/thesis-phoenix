use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :example_phx, ExamplePhxWeb.Endpoint,
  http: [port: 4001],
  server: true

config :example_phx, :sql_sandbox, true

<<<<<<< HEAD
=======
config :wallaby, driver: Wallaby.Experimental.Chrome

>>>>>>> WIP
# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :example_phx, ExamplePhx.Repo,
  adapter: Ecto.Adapters.Postgres,
<<<<<<< HEAD
  username: System.get_env("DATABASE_POSTGRESQL_USERNAME") || "postgres",
  password: System.get_env("DATABASE_POSTGRESQL_PASSWORD") || "postgres",
=======
  username: "postgres",
  password: "postgres",
>>>>>>> WIP
  database: "example_phx_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
