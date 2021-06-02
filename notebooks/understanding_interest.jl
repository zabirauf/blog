### A Pluto.jl notebook ###
# v0.14.1

using Markdown
using InteractiveUtils

# This Pluto notebook uses @bind for interactivity. When running this notebook outside of Pluto, the following 'mock version' of @bind gives bound variables a default value (instead of an error).
macro bind(def, element)
    quote
        local el = $(esc(element))
        global $(esc(def)) = Core.applicable(Base.get, el) ? Base.get(el) : missing
        el
    end
end

# ╔═╡ 94ee13d0-68fc-11eb-3a66-556a49f6a30c
begin
	using Pkg
	Pkg.activate(mktempdir())
	Pkg.add([
			Pkg.PackageSpec(name="PlutoUI"), 
			Pkg.PackageSpec(name="Plots"),
			Pkg.PackageSpec(name="PlotlyBase"),
			Pkg.PackageSpec(name="Plotly"),
			Pkg.PackageSpec(name="PyPlot")
			])

	using Plots
	#using Plotly
	#pyplot()
	#gr()
	using PlutoUI
end

# ╔═╡ e33794d0-68fc-11eb-2f88-73870e9d2bcc
md"""
# Understanding compounding
"""

# ╔═╡ f16b720e-68fc-11eb-0944-97ec68dd4d13
principal, returns = 100_000, 0.07

# ╔═╡ 47fbe8a0-6900-11eb-1c3c-438b8f65b071
monthly_add = 3_000

# ╔═╡ 50069fe0-6900-11eb-1e75-bbc297849ab7
yearly_add = 12 * monthly_add

# ╔═╡ fbf0db62-68fe-11eb-074a-b5724758e48e
compound(p, r, t) = p*(1+r)^t

# ╔═╡ 81181e10-6900-11eb-1288-79bb5dffa892
function compound_with_add(p, r, t, add)
	val = [compound(p,r,1)]
	for _ in 2:t
		curr = last(val) + add
		push!(val, compound(curr, r, 1))
	end
	
	return val
end

# ╔═╡ 5ea329fe-6900-11eb-2873-1dc0ffcc31cb
@bind years Slider(1:40, default=10, show_value=true)

# ╔═╡ c647c1c0-6900-11eb-2859-2f3ba80ff6c8
compound_with_add(principal, returns, years, yearly_add)

# ╔═╡ e453da40-68fc-11eb-2228-315ba9b7ffa1
let
	value_over_time = compound_with_add(principal, returns, years, yearly_add)
	bar(value_over_time, xlabel="Year", ylabel="Net worth", label="\$")
end

# ╔═╡ Cell order:
# ╠═94ee13d0-68fc-11eb-3a66-556a49f6a30c
# ╟─e33794d0-68fc-11eb-2f88-73870e9d2bcc
# ╠═f16b720e-68fc-11eb-0944-97ec68dd4d13
# ╠═47fbe8a0-6900-11eb-1c3c-438b8f65b071
# ╠═50069fe0-6900-11eb-1e75-bbc297849ab7
# ╠═fbf0db62-68fe-11eb-074a-b5724758e48e
# ╠═81181e10-6900-11eb-1288-79bb5dffa892
# ╠═5ea329fe-6900-11eb-2873-1dc0ffcc31cb
# ╠═c647c1c0-6900-11eb-2859-2f3ba80ff6c8
# ╠═e453da40-68fc-11eb-2228-315ba9b7ffa1
