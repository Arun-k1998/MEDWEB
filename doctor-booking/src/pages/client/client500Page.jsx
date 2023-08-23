import React from "react";

function client500Page() {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="flex flex-col gap-5" >
        <p className="font-semibold text-9xl" >500</p>
        <p>Server not responding</p>
      </div>
      <div>
        <p></p>
      </div>
    </div>
  );
}

export default client500Page;
