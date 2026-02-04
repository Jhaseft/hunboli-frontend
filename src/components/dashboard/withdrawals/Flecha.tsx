import { ChevronRight } from 'lucide-react';
export default function Flecha(){
    return(
        <div className="flex justify-center items-center">
                <div className="bg-teal-600/20 p-3 rounded-full border border-teal-600/40">
                  <ChevronRight
                    className="text-teal-400  transition-transform"
                    size={24}
                  />
                </div>
        </div>
    );
}