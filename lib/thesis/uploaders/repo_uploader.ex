defmodule Thesis.RepoUploader do
  @moduledoc """
  Handles file uploads
  """

  @behaviour Thesis.Uploader

  import Thesis.Config
  import Ecto.Query, only: [from: 2]
  alias Thesis.File

  def upload(file) do
    changeset = File.changeset(%File{}, file)
    do_upload(changeset)
  end

  defp do_upload(changeset) do
    case repo.insert_or_update(changeset) do
      {:ok, file} -> "/thesis/files/" <> file.slug
      {:error, _} -> ""
    end
  end
end
