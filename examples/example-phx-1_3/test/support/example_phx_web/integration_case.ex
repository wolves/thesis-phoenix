defmodule ExamplePhxWeb.IntegrationCase do
  use ExUnit.CaseTemplate
  use Hound.Helpers

  using do
    quote do
      use Hound.Helpers
      use Phoenix.ConnTest

      import ExamplePhxWeb.Router.Helpers
      import ExamplePhxWeb.IntegrationCase

      hound_session(
        additional_capabilities: %{
          chromeOptions: %{ "args" => [
            "--user-agent=#{Hound.Browser.user_agent(:chrome)}",
            "--headless",
            "--disable-gpu"
            ]
          }
        }
      )

      # The default endpoint for testing
      @endpoint ExamplePhxWeb.Endpoint
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(ExamplePhx.Repo)
    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(ExamplePhx.Repo, {:shared, self()})
    end

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end


  def scroll_to_element({:id, id}) do
    execute_script("window.scrollTo(0, document.getElementById('#{id}').offsetTop)")
  end
  def scroll_to_element({:class, class}) do
    execute_script("window.scrollTo(0, document.getElementsByClassName('#{String.replace(class, ".", "")}')[0].offsetTop)")
  end
end