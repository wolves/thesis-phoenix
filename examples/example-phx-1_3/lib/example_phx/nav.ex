defmodule ExamplePhx.Nav do
  import Ecto.Query, only: [from: 2]

  def pages do
    ExamplePhx.Repo.all(
      from p in Thesis.Page,
        where: not is_nil(p.template)
    )
  end
end