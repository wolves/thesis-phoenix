defmodule Mix.Tasks.Thesis.Install do
  use Mix.Task
  import Mix.Thesis.Utils

  @shortdoc "Generates Thesis code in your Phoenix app"

  @moduledoc """
  TODO: Write docs.
  """

  def run(_args) do
    thesis_templates
    thesis_npm
    thesis_config
  end

  def thesis_templates do
    template_files = %{
      "priv/templates/thesis.install/migration.exs" => "priv/repo/migrations/#{timestamp}_create_thesis_tables.exs",
      "priv/templates/thesis.install/auth.ex" => "lib/auth.ex"
    }

    template_files
    |> Stream.map(&render_eex/1)
    |> Stream.map(&copy_to_target/1)
    |> Stream.run
  end

  def thesis_npm do
    status_msg("updating", "package.json")
    System.cmd("npm install \"file:deps/thesis\" --save")
  end

  def thesis_config do
    status_msg("updating", "config/config.exs")
    dest_path = Path.join [File.cwd! | ~w(config)]
    dest_file_path = Path.join dest_path, "config.exs"
    File.read!(dest_file_path)
    |> insert_thesis
    |> append_to_file(dest_file_path)
  end

  defp insert_thesis(source) do
    unless String.contains? source, "config :thesis" do
      source <> """
      config :thesis,
        store: Thesis.Store,
        authorization: #{Mix.Phoenix.base}.ThesisAuth
      config :thesis, Thesis.Store, repo: #{Mix.Phoenix.base}.Repo
      """
    else
      status_msg("skipping", "thesis config. It already exists.")
      :skip
    end
  end

end
