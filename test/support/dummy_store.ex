defmodule Thesis.DummyStore do
  @behaviour Thesis.Store

  def page("/dynamic") do
    %Thesis.Page{id: 1, slug: "/dynamic", redirect_url: "/redirected?test=1"}
  end

  def page(slug) do
    %Thesis.Page{slug: slug}
  end

  def delete(_slug) do
    :ok
  end

  def page_contents(%Thesis.Page{} = _page) do
    []
  end

  def update(_page, _updated_contents, _backup) do
    :ok
  end

end
