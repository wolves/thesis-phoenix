defmodule Mix.Thesis.Utils do

  def get_package_path do
    __ENV__.file
    |> Path.dirname
    |> String.split("/lib/mix")
    |> hd
  end

  def get_module do
    Mix.Project.get
    |> Module.split
    |> Enum.reverse
    |> Enum.at(1)
  end

  @doc "Print a status message to the console"
  def status_msg(status, message),
    do: IO.puts "#{IO.ANSI.green}* #{status}#{IO.ANSI.reset} #{message}"

  @doc "Print an informational message without color"
  def debug(message), do: IO.puts "==> #{message}"
  @doc "Print an informational message in green"
  def info(message),  do: IO.puts "==> #{IO.ANSI.green}#{message}#{IO.ANSI.reset}"
  @doc "Print a warning message in yellow"
  def warn(message),  do: IO.puts "==> #{IO.ANSI.yellow}#{message}#{IO.ANSI.reset}"
  @doc "Print a notice in yellow"
  def notice(message), do: IO.puts "#{IO.ANSI.yellow}#{message}#{IO.ANSI.reset}"
  @doc "Print an error message in red"
  def error(message), do: IO.puts "==> #{IO.ANSI.red}#{message}#{IO.ANSI.reset}"

  def append_to_file(:skip, _dest_file_path), do: :ok
  def append_to_file(contents, dest_file_path) do
    File.write! dest_file_path, contents
  end

  def render_eex({source, target}) do
    source = Path.join(Application.app_dir(:thesis), source)
    rendered = EEx.eval_file(source, [base: Mix.Phoenix.base])
    {rendered, target}
  end

  def copy_to_target({contents, target}) do
    if File.exist?(target) do
      status_msg("exists", "#{target}")
    else
      File.write!(target, contents)
    end
  end

  # Taken from mix phoenix.gen.model
  # https://github.com/phoenixframework/phoenix/blob/d3af3397c1f47381dd7ea69869772174a0c1811b/lib/mix/tasks/phoenix.gen.model.ex#L198
  def timestamp do
    {{y, m, d}, {hh, mm, ss}} = :calendar.universal_time()
    "#{y}#{pad(m)}#{pad(d)}#{pad(hh)}#{pad(mm)}#{pad(ss)}"
  end

  defp pad(i) when i < 10, do: << ?0, ?0 + i >>
  defp pad(i), do: to_string(i)
end
