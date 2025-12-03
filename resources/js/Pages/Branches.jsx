import { Link } from "@inertiajs/react";

function Branches({ branches }) {
    //console.log(branches);

    return (
        <main className="p-4">
            <h2 className="text-2xl font-bold mb-4">Available Branches Under This Bank</h2>
             <p className="italic text-gray-500 text-sm mb-2">
                    Click Below to Register under a Branch</p>
                    

            <div className="space-y-3">
                {(branches?.data ?? branches)?.map((branch) => (
                    <Link
                        key={branch.branch_id}
                        href={route('branches', branch.branch_id)} // <-- use branch.branch_id
                        className="block bg-blue-600 text-white font-semibold p-4 rounded-xl shadow hover:scale-[1.03] active:animate-wiggle transition-all duration-200"
                    >
                        <div>{branch.name}</div>
                        <div className="text-sm text-gray-200">{branch.address}</div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

export default Branches;
