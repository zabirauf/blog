### A Pluto.jl notebook ###
# v0.14.5

using Markdown
using InteractiveUtils

# ╔═╡ 72d474ec-4327-11eb-26d0-072a3be1e84f
begin
	using Pkg
	
	Pkg.activate(mktempdir())
	
	#Pkg.add([])
end

# ╔═╡ 8423cb12-4273-11eb-2b32-5568d93043dd
md"""
## [zohaib.me](https://zohaib.me) - [@zabirauf](https://twitter.com/zabirauf)

# Quantum Computing for Computer Scientist
"""

# ╔═╡ 63dae6be-4364-11eb-056a-8785db062735
html"""
<iframe width="560" height="315" src="https://www.youtube.com/embed/F_Riqjdh2oM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
"""

# ╔═╡ 3cc2bb2e-43fa-11eb-3945-ff510d51fe72
md"""
[Slides](https://www.microsoft.com/en-us/research/uploads/prod/2018/05/40655.compressed.pdf) | [This Julia Notebook](https://gist.github.com/zabirauf/983e1d69f83112eb87f3632fc31da9d9)
"""

# ╔═╡ 6ac48d68-4364-11eb-1012-337857ac86a3
md"""
In this notebook we will be going over the lecture and creating some necessary functions and math to play around with qbits and operations for it. Feel free to play around and change variable or apply operations to see what actually happens.

I found it helpful creating it as I went over the lecture to see how things work mathematically discussed in the video. If you would like to make it interactive run it in [Pluto](https://github.com/fonsp/Pluto.jl) which uses [Julia](https://julialang.org).
"""

# ╔═╡ 8a5b0632-4325-11eb-018a-f7a3ef9e043d
md"""
## Definitions of qubits and other concepts
"""

# ╔═╡ 13358096-432f-11eb-3c6d-17b9a562fb39
md"""
### Defining classical bits

We create representation of a classic bit (cb) using a vector.
"""

# ╔═╡ da0ee23c-4273-11eb-0fbe-87b9d9df7612
cb_0 = [1.0 ; 0.0]

# ╔═╡ a07efc0c-4325-11eb-2cc4-a92d98495bc2
cb_1 = [0.0 ; 1.0]

# ╔═╡ 2b598b6c-4326-11eb-1801-3d5765d51bca
md"""
### Basic operation on classical bits
"""

# ╔═╡ a8a5749c-4325-11eb-3e86-cb66466a4617
begin
	identity(qb) = [1 0; 0 1] * qb
	negation(qb) = [0 1; 1 0] * qb
	
	const_zero(qb) = [1 1; 0 0] * qb
	const_one(qb) = [0 0; 1 1] * qb
end

# ╔═╡ 15bce1d2-4326-11eb-150a-9d72bde51c62
(before=cb_0, after=negation(cb_0))

# ╔═╡ 916735c4-4326-11eb-0fcb-673a126ce8d5
md"""
### Reversible computing

If you know the result and the operation then you can reverse it to get the original input. For example in above `negation` is a reversible function as if you negate twice then you get the original input. On the other hand things that remove state/info are not reversible e.g. `const_one` always sets to one so you can't know what the original input can be.

Quantum computing only uses reversible operations.

Fun fact: All quantum operations are their own inverses.
"""

# ╔═╡ d3ed69aa-4359-11eb-25dd-4ff19aa31f4d
@assert (cb_0 |> negation |> negation) == cb_0 "Negation should be reversible"

# ╔═╡ 2441b812-4327-11eb-3f75-c10037cd1f04
md"""
### Tensor product
"""

# ╔═╡ e921c808-4326-11eb-2ca2-d1eb00bb02ac
md"""
Tensor product $\otimes$ is defined as following

$v = \begin{bmatrix} v_{1} \\ v_{2} \\ \vdots \\ v_{n} \end{bmatrix}, w = \begin{bmatrix} w_{1} \\ w_{2} \\ \vdots \\ w_{n} \end{bmatrix}$

$v \otimes w = \begin{bmatrix} v_{1}w_{1} & v_{1}w_{2} & \cdots & v_{1}w_{n} \\ v_{2}w_{1} & v_{2}w_{2} & \cdots & v_{2}w_{n} \\ \vdots & \vdots & \ddots & \vdots \\ v_{n}w_{1} & v_{n}w_{2} & \cdots & v_{n}w_{n}\end{bmatrix}$

It changes the dimensions of the vector and the left matrix multiply with all on the right.
"""

# ╔═╡ 431158a6-4329-11eb-1327-85947b30268c
⊗ = kron #Defining the symbol to be used as tensor product in from std lib

# ╔═╡ ecd34d7c-4327-11eb-171d-2990322bb3f0
[1,2] ⊗ [3,4]

# ╔═╡ e7470d58-4327-11eb-2bd8-7b257c3ad6b1
[0,1] ⊗ [0,1] ⊗ [1,0]

# ╔═╡ d28b4466-4326-11eb-3c5e-e1565a299333
["x1", "x2"] ⊗ ["y1", "y2"]

# ╔═╡ 0670935a-432a-11eb-2181-557f26eb11e7
md"""
Multiple classic bits can be represented using tensor product e.g.
"""

# ╔═╡ 6eb38ba2-432a-11eb-31d3-2fe98e6a151e
# |00⟩
cb_00 = [1. , 0.] ⊗ [1. , 0]

# ╔═╡ 80974156-432a-11eb-2b15-6982ef60444f
# |01⟩
cb_01 = [1. , 0.] ⊗ [0. , 1.]

# ╔═╡ 885ad9ac-432a-11eb-3b15-f3c2f64783a3
# |10⟩
cb_10 = [0. , 1.] ⊗ [1. , 0.]

# ╔═╡ 8d9276e6-432a-11eb-1f90-ad762761499e
# |11⟩
cb_11 = [0. , 1.] ⊗ [0. , 1.]

# ╔═╡ 385dde4a-432f-11eb-1b66-977dc7fa634f
md"""
Hence to represent any classic bit as the vector, we can take tensor product e.g.
"""

# ╔═╡ 49af253c-432f-11eb-184e-936240d9723c
# To represent |101⟩
cb_1 ⊗ cb_0 ⊗ cb_1

# ╔═╡ 7d3269dc-432f-11eb-3126-e1e3388c2327
# To represent |111⟩
cb_1 ⊗ cb_1 ⊗ cb_1

# ╔═╡ b92e0540-432a-11eb-2e05-379067c4ab90
md"""
### Defining the control not operation
"""

# ╔═╡ 1fb20a1e-432b-11eb-19c2-fd75fee5ccd2
md"""
Similar to how in classic computing NAND gate is like the universal gate which you can use to construct all other gates, for reversible operations CNOT does something similar. 

Though it's not totally universal as there are some gates which need the Toffoli gate to build.
"""

# ╔═╡ c0a78e18-432a-11eb-1223-3bad74db13ef
control_not(qb) = [1 0 0 0; 0 1 0 0; 0 0 0 1; 0 0 1 0] * qb

# ╔═╡ e47b7b74-432c-11eb-2912-4f4bac4924f1
control_not(cb_10)

# ╔═╡ 33b85acc-432b-11eb-3d69-d31d47266874
# Passing in |10⟩ and result is |11⟩
@assert control_not(cb_10) == cb_11 "Value is not |11⟩"

# ╔═╡ 3d80c592-432d-11eb-0999-bfc399890c49
md"""
### Defining QBits and superposition
"""

# ╔═╡ 3e308c98-432d-11eb-1281-e3c7ce349a1c
md"""
All along we have been using qbits. The cbit vectors we have been using are just special cases of qbits.

A qbit is represented by $$\begin{pmatrix}a \\ b\end{pmatrix}$$ where $$a$$ and $$b$$ are complex number and it holds this property 

$$\left\Vert a \right\Vert^2 + \left\Vert b \right\Vert^2 = 1$$

The cbits also satisfy this property along with a lot of other varients e.g.

$$\begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{pmatrix} \Rightarrow \left\Vert \frac{1}{\sqrt{2}} \right\Vert^2 + \left\Vert \frac{1}{\sqrt{2}} \right\Vert^2 = 1$$

$$\begin{pmatrix} \frac{1}{2} \\ \frac{\sqrt{3}}{2} \end{pmatrix} \Rightarrow \left\Vert \frac{1}{2} \right\Vert^2 + \left\Vert \frac{\sqrt{3}}{2} \right\Vert^2 = 1 $$

$$\begin{pmatrix} -1 \\ 0 \end{pmatrix} \Rightarrow \left\Vert -1 \right\Vert^2 + \left\Vert 0 \right\Vert^2 = 1$$

$$\begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{-1}{\sqrt{2}} \end{pmatrix} \Rightarrow \left\Vert \frac{1}{\sqrt{2}} \right\Vert^2 + \left\Vert \frac{-1}{\sqrt{2}}  \right\Vert^2 = 1$$ 
"""

# ╔═╡ 3eb070ca-432d-11eb-0b24-27a2dcfc6795
md"""
As both $$a$$ and $$b$$ can be non zero e.g. $$\begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{pmatrix}$$ so that is an example of **superposition**. When we measure they collapse to a known value we generally see in cbits. $$\begin{pmatrix} a \\ b \end{pmatrix}$$ collapses to $$0$$ with probability $$\left\Vert a \right\Vert^2$$ and collapses to $$1$$ with probability $$\left\Vert b \right\Vert^2$$
"""

# ╔═╡ 6e49ccc0-435d-11eb-1742-e9261e144769
md"""
---
"""

# ╔═╡ 0a9d8200-435d-11eb-01fd-4f72e67df2dc
md"""
Similar to cbits, multiple qbits are also represented by tensor product $$\otimes$$
"""

# ╔═╡ ea52eeb4-435d-11eb-2b7e-09c0b6bf70ee
[1/√2 ; 1/√2] ⊗ [1/√2 ; 1/√2]

# ╔═╡ 08f1b8c8-435e-11eb-0a5b-d3fd80f7de3b
md"""
The above also shows that there is $$\frac{1}{4}$$ probability of collapsing to $$|00\rangle,|01\rangle,|10\rangle,|11\rangle$$
"""

# ╔═╡ 3440af16-435e-11eb-25dd-af037fc22701
md"""
The rule we had can hold for any probability state representing qbit e.g.

$$\begin{pmatrix} a \\ b \\ \vdots \\ n \end{pmatrix} \Rightarrow \left\Vert a \right\Vert^2 + \left\Vert b \right\Vert^2 \cdots \left\Vert n \right\Vert^2 = 1$$
"""

# ╔═╡ 0c8c0e5a-4360-11eb-042b-db3d0b2e485b
sum_quantum_state(qbs) = round(sum((abs.(qbs)).^2), digits=5)

# ╔═╡ 2686ae4c-435f-11eb-1441-4bf55d0cc55f
md"""
### Hadamard gate $$H|0\rangle$$ $$H|1\rangle$$
"""

# ╔═╡ 1704e6da-4361-11eb-1df2-9905c4fef512
md"""
Hadamard is a special gate which takes in the classic bit i.e. qbit in a state $$|0\rangle$$  or $$|1\rangle$$ and then puts it into superposition. The mathematical representation of it is

$$\begin{pmatrix} \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}} \end{pmatrix} \begin{pmatrix} a \\ b \end{pmatrix}$$

For $$|0\rangle$$ this leads to

$$\begin{pmatrix} \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}} \end{pmatrix} \begin{pmatrix} 1 \\ 0 \end{pmatrix} = \begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}}  \end{pmatrix}$$

and for $$|1\rangle$$ this leads to

$$\begin{pmatrix} \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & \frac{-1}{\sqrt{2}} \end{pmatrix} \begin{pmatrix} 0 \\ 1 \end{pmatrix} = \begin{pmatrix} \frac{1}{\sqrt{2}} \\ \frac{-1}{\sqrt{2}}  \end{pmatrix}$$

The reason we have $$-1$$ in the last element is so that we can differentiate when running the hadamard gate from $$|0\rangle$$ or $$|1\rangle$$ and make it a **reversible operation**. This is also representative of what happens in real world as the state of when running the gate through $$|0\rangle$$  or $$|1\rangle$$  is different and that info is carried on to further operations.
"""

# ╔═╡ bc6a103e-435f-11eb-3731-bba3e197f859
begin
	H_op = [1/√2 1/√2; 1/√2 -1/√2]
	hadamard(qb) = H_op * qb
end

# ╔═╡ d9ff7f80-435f-11eb-3e25-9be1324cea5c
hadamard(cb_0), hadamard(cb_1)

# ╔═╡ b63f9f84-4360-11eb-19eb-d7333c8370a4
@assert sum_quantum_state(hadamard(cb_1)) == 1 "The quantum state is incorrect"

# ╔═╡ da6e73a8-4360-11eb-2a00-155b1fac8e98
md"""
As it's reversible so you can go from superposition back to out of superposition and without measurement.
"""

# ╔═╡ 8ea44972-4361-11eb-167f-490694a636d6
cb_0 |> hadamard |> hadamard

# ╔═╡ 88eab6b2-4361-11eb-21d6-51deb59a3ffd
cb_1 |> hadamard |> hadamard

# ╔═╡ edcffdc2-4374-11eb-0bb6-b13e3e2a8a4f
md"""
You can also compose Hadamard operation to process bigger states e.g. for $$2$$ and $$3$$ qubits
"""

# ╔═╡ 037b38ee-4375-11eb-3ed4-819e2e7bfbef
(H_op ⊗ H_op) * cb_11

# ╔═╡ 1e68e11a-4375-11eb-1b3f-51f7aa9d84c9
(H_op ⊗ H_op ⊗ H_op) * (cb_0 ⊗ cb_1 ⊗ cb_1) # H|011⟩

# ╔═╡ 43b60a7e-4375-11eb-365b-fdf42513d80f
@assert sum_quantum_state((H_op ⊗ H_op ⊗ H_op) * (cb_0 ⊗ cb_1 ⊗ cb_1)) == 1

# ╔═╡ da788d42-4366-11eb-0398-45966d74f080
begin
	X = negation
	H = hadamard
	X,H
end

# ╔═╡ b46103f0-4361-11eb-345b-11d548d51ef7
md"""
## The Deutsch oracle
"""

# ╔═╡ b65306ec-4369-11eb-098d-b5d80739dabd
md"""
[Video mark](https://youtu.be/F_Riqjdh2oM?t=1994)
"""

# ╔═╡ 99e1431c-4368-11eb-02bc-b7300a33b4de
md"""
For the basic operations that we descrived earlier i.e. `identity`, `negation`, `constant-0` and `constant-1` if we had a blackbox which contained either of those and we can input something and see only its output then how would we know what function is in there?

In classical computing we would have to pass in first 0, see its output and then pass in 1, see its output to figure out. In quantum its the same as the state space required 2 bits to differentiate between 4 different functions.

If the question becomes that see if it has a constant function or variable (i.e. identity or negation), now the state we need to distinguish are 2 requiring 1 bit. In this case classical computing still needs two operations but quantum computing needs **only one operation**. This is what the power of quantum computing is.

Though the problem is that as in quantum world we can only work with operations that are reversible so how would we solve that for constant functions. The way is to pass in two wires one marked as output which the blackbox will write the output to and the other as input which the blackbox can use but it won't change. In this way you always know what the input was and the operation so you have a reversible operations.
"""

# ╔═╡ b95d8650-4364-11eb-1058-250c08209de3
blackbox_cnot = control_not((cb_0 |> X |> H) ⊗ (cb_0 |> X |> H))

# ╔═╡ 2a4c4f98-4367-11eb-23f4-d1f73b7bfd35
@assert blackbox_cnot == ((cb_0 |> H) ⊗ (cb_1 |> H)) "The black box CNOT value is not expected |01⟩"

# ╔═╡ 51a4fd90-4369-11eb-1f8a-c71736565e8e
md"""
This example might be contrived but somebody found the generallization of it where for $$n$$ bits in classical computer we would need to perform $$2^n$$ operations but in quantum computing we can limit it to only few operations to figure it out. This leads to more foundation building and eventually also help build the [Shor's algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm).
"""

# ╔═╡ 84a14ed4-43f4-11eb-1ba2-b9fa511ff9ae
md"""
## Quantum entaglement
"""

# ╔═╡ 8ee215d4-43f4-11eb-17de-4ffb8b648570
md"""
If the product state of $$2$$ qbits can't be factored then they are considred to be entangled.

Following is an example where it can't be factored as you can take the $$ad = 0$$ and for that to be right either $$a=0$$ or $$d=0$$ but that will invalidate the other values hence it can't be factored.

$$\begin{pmatrix} \frac{1}{\sqrt{2}} \\ 0 \\ 0 \\ \frac{1}{\sqrt{2}} \end{pmatrix} = \begin{pmatrix} a \\ b \end{pmatrix} \otimes \begin{pmatrix} c \\ d \end{pmatrix} \Rightarrow \begin{align} ac & = \frac{1}{\sqrt{2}} \\ ad & = 0 \\ bc & = 0 \\ bd & = \frac{1}{\sqrt{2}} \end{align}$$

"""

# ╔═╡ 847bf074-43f6-11eb-202f-e14cdc351d31
md"""
As in the following product state

$$\begin{pmatrix} \frac{1}{\sqrt{2}} \\ 0 \\ 0 \\ \frac{1}{\sqrt{2}} \end{pmatrix}$$

As for the above there is $$50\%$$ probability for it to be in state $$|00\rangle$$ or $$|11\rangle$$ which means when measured both the qbits will have the exact same value i.e. $$0$$ or $$1$$.

The following is how to put two qbits into entangled state
"""

# ╔═╡ cc46107c-43f5-11eb-21a6-3f3da3ef827f
entangle(qb1, qb2) = control_not(H(qb1) ⊗ qb2)

# ╔═╡ f6ea1a2e-43f5-11eb-3dbb-6708cba6153a
entangle(cb_0, cb_0)

# ╔═╡ 5510dc94-43f8-11eb-15c9-11924e0c8cde
md"""
## Quantum teleportation
"""

# ╔═╡ 5b9ffe32-43f8-11eb-3e3b-55c55ac69d63
md"""
Quantum teleportation allows you to send the state of an arbitrary qbit from one location to another by way of two other entangled qbits. You can transfer qbit states (cut and paste) but not clone them and it is called no-cloning theorem.

The teleportation is not faster-than-light because some classical information must be sent.

> Question: If classical information must be sent then what's the use?
"""

# ╔═╡ Cell order:
# ╟─8423cb12-4273-11eb-2b32-5568d93043dd
# ╟─72d474ec-4327-11eb-26d0-072a3be1e84f
# ╟─63dae6be-4364-11eb-056a-8785db062735
# ╟─3cc2bb2e-43fa-11eb-3945-ff510d51fe72
# ╟─6ac48d68-4364-11eb-1012-337857ac86a3
# ╟─8a5b0632-4325-11eb-018a-f7a3ef9e043d
# ╟─13358096-432f-11eb-3c6d-17b9a562fb39
# ╠═da0ee23c-4273-11eb-0fbe-87b9d9df7612
# ╠═a07efc0c-4325-11eb-2cc4-a92d98495bc2
# ╟─2b598b6c-4326-11eb-1801-3d5765d51bca
# ╠═a8a5749c-4325-11eb-3e86-cb66466a4617
# ╠═15bce1d2-4326-11eb-150a-9d72bde51c62
# ╟─916735c4-4326-11eb-0fcb-673a126ce8d5
# ╠═d3ed69aa-4359-11eb-25dd-4ff19aa31f4d
# ╟─2441b812-4327-11eb-3f75-c10037cd1f04
# ╟─e921c808-4326-11eb-2ca2-d1eb00bb02ac
# ╠═431158a6-4329-11eb-1327-85947b30268c
# ╠═ecd34d7c-4327-11eb-171d-2990322bb3f0
# ╠═e7470d58-4327-11eb-2bd8-7b257c3ad6b1
# ╠═d28b4466-4326-11eb-3c5e-e1565a299333
# ╟─0670935a-432a-11eb-2181-557f26eb11e7
# ╠═6eb38ba2-432a-11eb-31d3-2fe98e6a151e
# ╠═80974156-432a-11eb-2b15-6982ef60444f
# ╠═885ad9ac-432a-11eb-3b15-f3c2f64783a3
# ╠═8d9276e6-432a-11eb-1f90-ad762761499e
# ╟─385dde4a-432f-11eb-1b66-977dc7fa634f
# ╠═49af253c-432f-11eb-184e-936240d9723c
# ╠═7d3269dc-432f-11eb-3126-e1e3388c2327
# ╟─b92e0540-432a-11eb-2e05-379067c4ab90
# ╟─1fb20a1e-432b-11eb-19c2-fd75fee5ccd2
# ╠═c0a78e18-432a-11eb-1223-3bad74db13ef
# ╠═e47b7b74-432c-11eb-2912-4f4bac4924f1
# ╠═33b85acc-432b-11eb-3d69-d31d47266874
# ╟─3d80c592-432d-11eb-0999-bfc399890c49
# ╟─3e308c98-432d-11eb-1281-e3c7ce349a1c
# ╟─3eb070ca-432d-11eb-0b24-27a2dcfc6795
# ╟─6e49ccc0-435d-11eb-1742-e9261e144769
# ╟─0a9d8200-435d-11eb-01fd-4f72e67df2dc
# ╠═ea52eeb4-435d-11eb-2b7e-09c0b6bf70ee
# ╟─08f1b8c8-435e-11eb-0a5b-d3fd80f7de3b
# ╟─3440af16-435e-11eb-25dd-af037fc22701
# ╠═0c8c0e5a-4360-11eb-042b-db3d0b2e485b
# ╟─2686ae4c-435f-11eb-1441-4bf55d0cc55f
# ╟─1704e6da-4361-11eb-1df2-9905c4fef512
# ╠═bc6a103e-435f-11eb-3731-bba3e197f859
# ╠═d9ff7f80-435f-11eb-3e25-9be1324cea5c
# ╠═b63f9f84-4360-11eb-19eb-d7333c8370a4
# ╟─da6e73a8-4360-11eb-2a00-155b1fac8e98
# ╠═8ea44972-4361-11eb-167f-490694a636d6
# ╠═88eab6b2-4361-11eb-21d6-51deb59a3ffd
# ╟─edcffdc2-4374-11eb-0bb6-b13e3e2a8a4f
# ╠═037b38ee-4375-11eb-3ed4-819e2e7bfbef
# ╠═1e68e11a-4375-11eb-1b3f-51f7aa9d84c9
# ╟─43b60a7e-4375-11eb-365b-fdf42513d80f
# ╟─da788d42-4366-11eb-0398-45966d74f080
# ╟─b46103f0-4361-11eb-345b-11d548d51ef7
# ╟─b65306ec-4369-11eb-098d-b5d80739dabd
# ╟─99e1431c-4368-11eb-02bc-b7300a33b4de
# ╠═b95d8650-4364-11eb-1058-250c08209de3
# ╠═2a4c4f98-4367-11eb-23f4-d1f73b7bfd35
# ╟─51a4fd90-4369-11eb-1f8a-c71736565e8e
# ╟─84a14ed4-43f4-11eb-1ba2-b9fa511ff9ae
# ╟─8ee215d4-43f4-11eb-17de-4ffb8b648570
# ╟─847bf074-43f6-11eb-202f-e14cdc351d31
# ╠═cc46107c-43f5-11eb-21a6-3f3da3ef827f
# ╠═f6ea1a2e-43f5-11eb-3dbb-6708cba6153a
# ╟─5510dc94-43f8-11eb-15c9-11924e0c8cde
# ╟─5b9ffe32-43f8-11eb-3e3b-55c55ac69d63
