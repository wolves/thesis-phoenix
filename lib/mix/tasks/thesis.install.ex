defmodule Mix.Tasks.Thesis.Install do
  use Mix.Task

  @shortdoc "Generates Thesis code in your Phoenix app"

  @moduledoc """
  TODO: Write docs.
  """

  def run(_args) do
    template_files = %{
      "priv/templates/thesis.install/migration.exs" => "priv/repo/migrations/#{timestamp}_create_thesis_tables.exs"
    }

    template_files
    |> Stream.map(&render_eex/1)
    |> Stream.map(&copy_to_target/1)
    |> Stream.run
  end

  defp render_eex({source, target}) do
    source = Path.join(Application.app_dir(:thesis), source)
    rendered = EEx.eval_file(source, [base: Mix.Phoenix.base])
    {rendered, target}
  end

  defp copy_to_target({contents, target}) do
    File.write!(target, contents)
  end

  # Taken from mix phoenix.gen.model
  # https://github.com/phoenixframework/phoenix/blob/d3af3397c1f47381dd7ea69869772174a0c1811b/lib/mix/tasks/phoenix.gen.model.ex#L198
  defp timestamp do
    {{y, m, d}, {hh, mm, ss}} = :calendar.universal_time()
    "#{y}#{pad(m)}#{pad(d)}#{pad(hh)}#{pad(mm)}#{pad(ss)}"
  end

  defp pad(i) when i < 10, do: << ?0, ?0 + i >>
  defp pad(i), do: to_string(i)
end
