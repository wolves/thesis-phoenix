defmodule <%= base %>.ThesisAuth do
  def page_is_editable?(conn) do
    # Editable by the world
    true

    # Or use your own auth strategy. Learn more:
    # https://github.com/infinitered/thesis-phoenix#authorization
  end
end
