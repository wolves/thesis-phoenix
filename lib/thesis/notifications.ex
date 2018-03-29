defmodule Thesis.Notifications do
  @moduledoc """
  Builds a map of Notifications that is passed to the client side. The key should be a
  representation of the category/type of notification (this is used to determine where and how it's
  displayed). The value is a list of notification strings.

  Example of final map:
  %{
    "page-settings": [],
    "add-page": [],
    "import-export-restore": [],
    "other": []
  }
  """

  alias Thesis.Backup
  import Thesis.Config
  import Thesis.Utilities
  import Ecto.Query, only: [limit: 2]

  @allowed_notification_keys [
    "page-settings",
    "add-page",
    "import-export-restore",
    "other",
    :page_settings,
    :add_page,
    :import_export_restore,
    :other
  ]

  def all(page) do
    %{
      "page-settings" => [],
      "add-page" => [],
      "import-export-restore" => [],
      "other" => []
    }
    |> notifications_from_host_app(notifications())
    |> notifications_regarding_env(Mix.env)
    |> notifications_regarding_page(page)
  end

  def notifications_regarding_page(acc, nil), do: acc
  def notifications_regarding_page(acc, %_{}) do
    acc
  end

  def notifications_regarding_env(acc, :test), do: acc
  def notifications_regarding_env(acc, _) do
    acc
    |> notification_to_run_migration_for_version_0_2_1()
  end

  @doc """
  Adds notifications provided by the host app to the accumulator.

      iex> notifications_from_host_app(%{"page-settings" => []}, [page_settings: ["notif"]])
      %{"page-settings" => ["notif"]}
      iex> notifications_from_host_app(%{"page-settings" => []}, [page_settings: :invalid])
      %{"page-settings" => []}
      iex> notifications_from_host_app(%{"page-settings" => ["notif1"]}, [page_settings: ["notif2"]])
      %{"page-settings" => ["notif2", "notif1"]}
      iex> notifications_from_host_app(%{"other" => [], "add-page" => ["notif"]}, [other: ["notif"]])
      %{"other" => ["notif"], "add-page" => ["notif"]}
      iex> notifications_from_host_app(%{"other" => []}, nil)
      %{"other" => []}
  """
  def notifications_from_host_app(acc, notifications) when is_list(notifications) do
    case verify_notifications_structure(notifications) do
      true ->
        Enum.reduce(notifications, acc, fn({type, list}, acc) ->
          update_notifications_map(acc, type, list)
        end)
      _ -> acc
    end
  end
  def notifications_from_host_app(acc, _), do: acc

  @doc """
  Verifies that the notifications provided by the host app are in the correct format.

      iex> verify_notifications_structure([:invalid])
      false
      iex> verify_notifications_structure(%{})
      false
      iex> verify_notifications_structure(%{invalid_key: []})
      false
      iex> verify_notifications_structure(%{add_page: "invalid value"})
      false
      iex> verify_notifications_structure(%{add_page: ["notif", "notif", :atom]})
      false
      iex> verify_notifications_structure([add_page: [], page_settings: ["notif"]])
      false
  """
  def verify_notifications_structure(notifications) when is_list(notifications) and length(notifications) == 0, do: false
  def verify_notifications_structure(notifications) when is_list(notifications) do
    case Keyword.keyword?(notifications) do
      true ->
        notifications
        |> Enum.map(fn(n) ->
          n
          |> is_notification_key_allowed?()
          |> is_notification_value_data_type_valid?()
          |> is_notification_value_valid?()
        end)
        |> Enum.all?()
      _ -> false
    end
  end
  def verify_notifications_structure(_), do: false

  defp update_notifications_map(acc, type, notifications_list) when is_function(notifications_list) do
    update_notifications_map(acc, type, notifications_list.())
  end
  defp update_notifications_map(acc, type, notifications_list) when is_atom(type) do
    update_notifications_map(acc, parameterize(type), notifications_list)
  end
  defp update_notifications_map(acc, type, notifications_list) do
    %{acc | type => notifications_list ++ acc["#{type}"]}
  end

  # UTILITIES
  defp version() do
    {:ok, version} = :application.get_key(:thesis, :vsn)
    List.to_string(version)
  end

  defp is_notification_key_allowed?({k, _} = n) when k in @allowed_notification_keys, do: n
  defp is_notification_key_allowed?(_), do: false

  defp is_notification_value_data_type_valid?({_, v} = n) when is_list(v) or is_function(v), do: n
  defp is_notification_value_data_type_valid?(_), do: false

  defp is_notification_value_valid?({_, v}) when is_list(v) and length(v) == 0, do: false
  defp is_notification_value_valid?({k, v}) when is_function(v) do
    is_notification_value_valid?({k, v.()})
  end
  defp is_notification_value_valid?({_, v} = n) when is_list(v) do
    case is_list(v) and Enum.all?(v, &is_binary/1) do
      true -> n
      _ -> false
    end
  end
  defp is_notification_value_valid?(_), do: false

  # NOTIFICATIONS
  # remove in 0.3.0: reminder that revisions will not work without the new migration
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
    update_notifications_map(acc, "import-export-restore", ["Page revisions may not work! Please ask your developer to update Thesis."])
  end
  defp notification_to_run_migration_for_version_0_2_1(acc, _), do: acc
end
