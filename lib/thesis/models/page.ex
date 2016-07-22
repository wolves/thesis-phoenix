defmodule Thesis.Page do
  use Ecto.Schema

  @type t :: %Thesis.Page{
    id: any,
    slug: String.t,
    title: String.t | nil,
    template: String.t | nil,
    redirect_url: String.t | nil,
    description: String.t | nil,
    inserted_at: any,
    updated_at: any
  }

  schema "thesis_pages" do
    field :slug, :string
    field :title, :string
    field :template, :string
    field :redirect_url, :string
    field :description, :string

    timestamps
  end

  @doc """
  Returns whether the page redirects to another page.

  Examples:

      iex> Thesis.Page.redirected?(%Thesis.Page{slug: "", redirect_url: nil})
      false
      iex> Thesis.Page.redirected?(%Thesis.Page{slug: "", redirect_url: ""})
      false
      iex> Thesis.Page.redirected?(%Thesis.Page{slug: "", redirect_url: "/asdf"})
      true
  """
  def redirected?(nil), do: false
  def redirected?(%Thesis.Page{redirect_url: url}) when url in [nil, ""], do: false
  def redirected?(_), do: true

end
