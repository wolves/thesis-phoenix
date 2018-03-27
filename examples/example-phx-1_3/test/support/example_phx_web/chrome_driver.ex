defmodule ExamplePhxWeb.ChromeDriver do
  @moduledoc """
  Provides helpers to automatically start ChromeDriver at the beginning of a test
  and then close it when the tests have completed.
  """

  use GenServer

  @executable "chromedriver"

  def start_link do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(_) do
    Process.flag(:trap_exit, true)
    swallow_cmd("killall chromedriver")

    Port.open({:spawn, "#{@executable} --wd"}, [])

    System.at_exit fn(_exit_status) ->
      swallow_cmd "killall chromedriver"
    end

    {:ok, wait_for_chromedriver_start()}
  end

  def terminate(_, _) do
    swallow_cmd("killall chromedriver")
  end

  def handle_info({:EXIT, _port, :normal}, _state) do
    :ok
  end

  defp wait_for_chromedriver_start() do
    started =
      receive do
        {_port, {:data, data}} ->
          cond do
            to_string(data) =~ ~r/9515/ -> true
            to_string(data) =~ ~r/No such file or directory/ ->
              raise "ChromeDriver could not be started"
          end
      end

    if started do
      :ok
    else
      wait_for_chromedriver_start()
    end
  end

  # Sends standard output and standard error to /dev/null,
  # preventing it from being printed to the screen.
  defp swallow_cmd(cmd) do
    "#{cmd} > /dev/null 2>&1"
    |> to_charlist
    |> :os.cmd
  end
end
