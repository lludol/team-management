import Link from "next/link";

const Menu = () => {
	return (
		<div className="p-4 bg-base-200 w-56">
			<ul className="menu w-full">
				<li>
					<Link href="/">Home</Link>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
