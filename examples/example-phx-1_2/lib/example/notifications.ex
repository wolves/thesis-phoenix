defmodule Example.Notifications do
  def random_notification(_conn) do
    Enum.random(for i <- 1..20, do: ["Example notification #{i}"])
  end
end
