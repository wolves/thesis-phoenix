defmodule Thesis.Uploader do
  @moduledoc """
  Thesis.Uploader is an Elixir "behaviour" that defines the public function
  interface necessary for Thesis to upload files and images.

  NOTE: This is under active development.

  There are currently no required functions. Reserved for future use.
  """

  @callback upload(File.t) :: atom
end
