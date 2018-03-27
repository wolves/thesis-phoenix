defmodule Thesis.Notifications do
  @moduledoc """
  Builds a map of Notifications that is passed to the client side. The key should be a
  representation of the categofy/type of notification (this is used to determine where and how it's
  displayed). The value is a list of notification strings.
  """

  alias Thesis.Backup
  import Thesis.Config
  import Thesis.Utilities
  import Ecto.Query, only: [limit: 2]

  def all(page) do
    %{}
    |> environment_notifications()
    |> page_notifications(page)
    |> IO.inspect
  end

  defp page_notifications(acc, nil), do: acc
  defp page_notifications(acc, %_{} = page) do
    acc
  end

  defp environment_notifications(acc) do
    acc
    |> notification_to_run_migration_for_version_0_2_1()
  end

  # NOTIFICATIONS
  # remove in 0.3.0
  defp notification_to_run_migration_for_version_0_2_1(acc) do
    notification_to_run_migration_for_version_0_2_1(acc, Version.compare("0.2.1", version()))
  end
  defp notification_to_run_migration_for_version_0_2_1(acc, nil), do: acc
  defp notification_to_run_migration_for_version_0_2_1(acc, c) when is_atom(c) and c in [:eq, :gt] do
    notification_to_run_migration_for_version_0_2_1(acc, repo().one(limit(Backup, 1)))
  end
  defp notification_to_run_migration_for_version_0_2_1(acc, %{page_data: data}) do
    notification_to_run_migration_for_version_0_2_1(acc, String.valid?(data))
  end
  defp notification_to_run_migration_for_version_0_2_1(acc, false) do
    notifications = acc["import-export-restore"] || []
    Map.put(acc, "import-export-restore", ["The revisions functionality may not work! Please ask your developer to run migrations." | notifications])
  end
  defp notification_to_run_migration_for_version_0_2_1(acc, _), do: acc

  # UTILITIES
  defp version() do
    {:ok, version} = :application.get_key(:thesis, :vsn)
    List.to_string(version)
  end
end
